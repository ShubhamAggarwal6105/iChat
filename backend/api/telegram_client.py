import asyncio
import json
import threading
from datetime import datetime, timedelta
from telethon import TelegramClient
from telethon.tl.types import User, Chat, Channel
from django.conf import settings
import os
from concurrent.futures import ThreadPoolExecutor
import queue

class TelegramService:
    def __init__(self):
        self.api_id = getattr(settings, 'TELEGRAM_API_ID', 26603244)
        self.api_hash = getattr(settings, 'TELEGRAM_API_HASH', 'c16129679c2a6bd437f094b9c3337466')
        self.client = None
        self.is_authenticated = False
        self.phone_number = None
        self._loop = None
        self._thread = None
        self._start_background_loop()

    def _start_background_loop(self):
        """Start a background thread with its own event loop"""
        def run_loop():
            self._loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self._loop)
            self._loop.run_forever()
        
        self._thread = threading.Thread(target=run_loop, daemon=True)
        self._thread.start()

    def _run_async(self, coro):
        """Run async coroutine in the background thread"""
        if not self._loop:
            raise RuntimeError("Background loop not started")
        
        future = asyncio.run_coroutine_threadsafe(coro, self._loop)
        return future.result(timeout=30)  # 30 second timeout

    async def _initialize_client(self, phone_number):
        """Initialize Telegram client with phone number"""
        if self.client and self.client.is_connected():
            if self.phone_number == phone_number:
                return self.client
            else:
                await self.client.disconnect()
        
        self.phone_number = phone_number
        session_name = f'sessions/session_{phone_number.replace("+", "").replace(" ", "").replace("-", "")}'
        
        # Create sessions directory if it doesn't exist
        os.makedirs('sessions', exist_ok=True)
        
        self.client = TelegramClient(session_name, self.api_id, self.api_hash)
        await self.client.connect()
        return self.client

    def send_code_request(self, phone_number):
        """Send verification code to phone number"""
        async def _send_code():
            try:
                await self._initialize_client(phone_number)
                result = await self.client.send_code_request(phone_number)
                return {
                    'success': True,
                    'phone_code_hash': result.phone_code_hash,
                    'message': 'Verification code sent successfully'
                }
            except Exception as e:
                return {
                    'success': False,
                    'error': str(e)
                }
        
        return self._run_async(_send_code())

    def verify_code(self, phone_number, code, phone_code_hash=None):
        """Verify the code and complete authentication"""
        async def _verify_code():
            try:
                await self._initialize_client(phone_number)
                
                if not await self.client.is_user_authorized():
                    await self.client.sign_in(phone_number, code)
                
                self.is_authenticated = True
                
                # Get user info
                me = await self.client.get_me()
                user_data = {
                    'id': str(me.id),
                    'name': f"{me.first_name or ''} {me.last_name or ''}".strip(),
                    'username': me.username or f"user_{me.id}",
                    'phone': me.phone,
                    'avatar': None
                }
                
                return {
                    'success': True,
                    'user': user_data,
                    'message': 'Authentication successful'
                }
            except Exception as e:
                return {
                    'success': False,
                    'error': str(e)
                }
        
        return self._run_async(_verify_code())

    def is_user_authenticated(self):
        """Check if user is authenticated"""
        async def _check_auth():
            if not self.client:
                return False
            try:
                return await self.client.is_user_authorized()
            except:
                return False
        
        return self._run_async(_check_auth())

    def get_groups(self):
        """Get all groups/chats the user is part of"""
        async def _get_groups():
            if not self.client:
                return {'success': False, 'error': 'Client not initialized'}

            try:
                # Check if authenticated
                if not await self.client.is_user_authorized():
                    return {'success': False, 'error': 'Not authenticated'}

                groups = []
                async for dialog in self.client.iter_dialogs():
                    if dialog.is_group or dialog.is_channel:
                        # Get participant count
                        participants_count = 0
                        try:
                            if hasattr(dialog.entity, 'participants_count'):
                                participants_count = dialog.entity.participants_count
                            else:
                                # For smaller groups, count manually
                                participants = await self.client.get_participants(dialog.entity)
                                participants_count = len(participants)
                        except:
                            participants_count = 0

                        # Get last message
                        last_message = None
                        if dialog.message:
                            sender_name = "Unknown"
                            try:
                                if dialog.message.sender:
                                    if hasattr(dialog.message.sender, 'first_name'):
                                        sender_name = f"{dialog.message.sender.first_name or ''} {dialog.message.sender.last_name or ''}".strip()
                                    elif hasattr(dialog.message.sender, 'title'):
                                        sender_name = dialog.message.sender.title
                            except:
                                pass

                            last_message = {
                                'id': str(dialog.message.id),
                                'chatId': str(dialog.id),
                                'senderId': str(dialog.message.sender_id) if dialog.message.sender_id else 'unknown',
                                'senderName': sender_name,
                                'content': dialog.message.text or '[Media]',
                                'timestamp': dialog.message.date.isoformat() if dialog.message.date else datetime.now().isoformat()
                            }

                        group_data = {
                            'id': str(dialog.id),
                            'telegram_id': dialog.id,
                            'name': dialog.name or 'Unnamed Group',
                            'type': 'group',
                            'avatar': None,
                            'unreadCount': dialog.unread_count or 0,
                            'members': participants_count,
                            'lastMessage': last_message
                        }
                        groups.append(group_data)

                return {
                    'success': True,
                    'groups': groups
                }
            except Exception as e:
                return {
                    'success': False,
                    'error': str(e)
                }
        
        return self._run_async(_get_groups())

    def get_messages(self, group_id, limit=100):
        """Get messages from a specific group"""
        async def _get_messages():
            if not self.client:
                return {'success': False, 'error': 'Client not initialized'}

            try:
                # Check if authenticated
                if not await self.client.is_user_authorized():
                    return {'success': False, 'error': 'Not authenticated'}

                # Convert string ID back to int for Telegram API
                telegram_group_id = int(group_id)
                
                messages = await self.client.get_messages(telegram_group_id, limit=limit)
                formatted_messages = []

                for msg in messages:
                    if not msg.text:  # Skip non-text messages for now
                        continue

                    # Get sender information
                    sender_name = "Unknown"
                    sender_id = "unknown"
                    
                    try:
                        if msg.sender:
                            sender_id = str(msg.sender_id)
                            if hasattr(msg.sender, 'first_name'):
                                sender_name = f"{msg.sender.first_name or ''} {msg.sender.last_name or ''}".strip()
                            elif hasattr(msg.sender, 'title'):
                                sender_name = msg.sender.title
                            elif hasattr(msg.sender, 'username'):
                                sender_name = msg.sender.username
                    except:
                        pass

                    # Basic AI analysis
                    is_important = self._analyze_importance(msg.text)
                    has_event, event_details = self._extract_event_info(msg.text)
                    
                    message_data = {
                        'id': str(msg.id),
                        'chatId': str(group_id),
                        'senderId': sender_id,
                        'senderName': sender_name,
                        'content': msg.text,
                        'timestamp': msg.date.isoformat() if msg.date else datetime.now().isoformat(),
                        'isImportant': is_important,
                        'hasEvent': has_event,
                        'eventDetails': event_details,
                        'isFakeNews': False
                    }
                    formatted_messages.append(message_data)

                return {
                    'success': True,
                    'messages': formatted_messages
                }
            except Exception as e:
                return {
                    'success': False,
                    'error': str(e)
                }
        
        return self._run_async(_get_messages())

    def _analyze_importance(self, text):
        """Basic importance analysis"""
        important_keywords = [
            'urgent', 'important', 'emergency', 'meeting', 'deadline',
            'maintenance', 'announcement', 'notice', 'alert', 'breaking'
        ]
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in important_keywords)

    def _extract_event_info(self, text):
        """Basic event extraction"""
        event_keywords = ['meeting', 'event', 'schedule', 'appointment', 'call']
        text_lower = text.lower()
        
        has_event = any(keyword in text_lower for keyword in event_keywords)
        
        if has_event:
            event_details = {
                'title': 'Extracted Event',
                'date': (datetime.now() + timedelta(days=1)).isoformat(),
                'time': '7:00 PM',
                'description': text[:100] + '...' if len(text) > 100 else text,
                'type': 'meeting'
            }
            return True, event_details
        
        return False, None

    def disconnect(self):
        """Disconnect the client"""
        async def _disconnect():
            if self.client:
                await self.client.disconnect()
                self.is_authenticated = False
                self.client = None
        
        return self._run_async(_disconnect())

# Global instance
telegram_service = TelegramService()
