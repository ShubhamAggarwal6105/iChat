import asyncio
import json
import threading
import re
from datetime import datetime, timedelta
from telethon import TelegramClient
from telethon.tl.types import User, Chat, Channel
from django.conf import settings
import os
from concurrent.futures import ThreadPoolExecutor
import queue
import google.generativeai as genai

class TelegramService:
    def __init__(self):
        self.api_id = getattr(settings, 'TELEGRAM_API_ID', 26603244)
        self.api_hash = getattr(settings, 'TELEGRAM_API_HASH', 'c16129679c2a6bd437f094b9c3337466')
        self.client = None
        self.is_authenticated = False
        self.phone_number = None
        self._loop = None
        self._thread = None
        
        # Initialize Gemini AI
        self.gemini_api_key = getattr(settings, 'GEMINI_API_KEY', 'AIzaSyBpknWU2WaUKEYY1oh4QRXAkoKnvP-8loE')
        genai.configure(api_key=self.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        
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

                    message_data = {
                        'id': str(msg.id),
                        'chatId': str(group_id),
                        'senderId': sender_id,
                        'senderName': sender_name,
                        'content': msg.text,
                        'timestamp': msg.date.isoformat() if msg.date else datetime.now().isoformat(),
                        'isImportant': False,  # Will be set by AI analysis
                        'hasEvent': False,     # Will be set by AI analysis
                        'eventDetails': None,  # Will be set by AI analysis
                        'isFakeNews': False    # Will be set by AI analysis
                    }
                    formatted_messages.append(message_data)

                # Perform AI analysis on all messages at once
                if formatted_messages:
                    analyzed_messages = self._analyze_messages_with_ai(formatted_messages)
                    return {
                        'success': True,
                        'messages': analyzed_messages
                    }
                else:
                    return {
                        'success': True,
                        'messages': []
                    }

            except Exception as e:
                return {
                    'success': False,
                    'error': str(e)
                }
        
        return self._run_async(_get_messages())

    def _analyze_messages_with_ai(self, messages):
        """Analyze messages using Gemini AI for importance, events, and fake news detection"""
        try:
            # Prepare messages for AI analysis
            messages_for_analysis = []
            for i, msg in enumerate(messages):
                messages_for_analysis.append({
                    'index': i,
                    'sender': msg['senderName'],
                    'content': msg['content'],
                    'timestamp': msg['timestamp']
                })

            # Create the prompt for Gemini
            prompt = self._create_analysis_prompt(messages_for_analysis)
            
            # Get AI response
            response = self.model.generate_content(prompt)
            ai_analysis = self._parse_ai_response(response.text)
            
            # Apply AI analysis to messages
            for analysis in ai_analysis:
                if 'index' in analysis and analysis['index'] < len(messages):
                    msg_index = analysis['index']
                    messages[msg_index]['isImportant'] = analysis.get('isImportant', False)
                    messages[msg_index]['isFakeNews'] = analysis.get('isFakeNews', False)
                    messages[msg_index]['hasEvent'] = analysis.get('hasEvent', False)
                    
                    if analysis.get('hasEvent') and 'eventDetails' in analysis:
                        messages[msg_index]['eventDetails'] = analysis['eventDetails']

            return messages

        except Exception as e:
            print(f"AI analysis error: {e}")
            # Return messages with default values if AI analysis fails
            return messages

    def _create_analysis_prompt(self, messages):
        """Create a comprehensive prompt for AI analysis"""
        messages_text = ""
        for msg in messages:
            messages_text += f"Index {msg['index']}: [{msg['sender']}] {msg['content']}\n"

        prompt = f"""
Analyze the following messages from a Telegram group chat and classify each message. Return your analysis in JSON format.

Messages:
{messages_text}

For each message, determine:
1. isImportant: true if the message contains urgent information, announcements, deadlines, emergencies, maintenance notices, important updates, or anything requiring immediate attention
2. isFakeNews: true if the message contains misinformation, unverified claims, conspiracy theories, or suspicious content
3. hasEvent: true if the message mentions a specific event, meeting, appointment, deadline, or scheduled activity
4. eventDetails: if hasEvent is true, extract:
   - title: Brief title for the event
   - date: Event date (if mentioned, otherwise estimate based on context like "tomorrow", "next week", etc.)
   - time: Event time (if mentioned, otherwise estimate reasonable time)
   - description: Brief description of the event
   - type: one of "meeting", "call", "task", "event", "deadline", "maintenance"

Return ONLY a JSON array with this exact structure:
[
  {{
    "index": 0,
    "isImportant": boolean,
    "isFakeNews": boolean,
    "hasEvent": boolean,
    "eventDetails": {{
      "title": "string",
      "date": "YYYY-MM-DDTHH:mm:ss.sssZ",
      "time": "HH:MM AM/PM",
      "description": "string",
      "type": "meeting|call|task|event|deadline|maintenance"
    }} // only include if hasEvent is true
  }}
]

Important guidelines:
- Be conservative with isImportant - only mark truly urgent/important messages
- Be very careful with isFakeNews - only mark obvious misinformation
- For dates, if relative time is mentioned (tomorrow, next week), calculate actual date
- If no specific time is mentioned for events, use reasonable defaults (meetings: 2:00 PM, maintenance: 9:00 AM, etc.)
- Ensure all JSON is properly formatted and valid
"""
        return prompt

    def _parse_ai_response(self, response_text):
        """Parse AI response and extract analysis data"""
        try:
            # Clean the response text
            response_text = response_text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            # Parse JSON
            analysis_data = json.loads(response_text)
            
            # Process dates in eventDetails
            for item in analysis_data:
                if item.get('hasEvent') and 'eventDetails' in item:
                    event_details = item['eventDetails']
                    
                    # If date is relative, convert to actual date
                    if 'date' in event_details:
                        date_str = event_details['date']
                        if 'tomorrow' in date_str.lower():
                            event_details['date'] = (datetime.now() + timedelta(days=1)).isoformat()
                        elif 'today' in date_str.lower():
                            event_details['date'] = datetime.now().isoformat()
                        elif 'next week' in date_str.lower():
                            event_details['date'] = (datetime.now() + timedelta(days=7)).isoformat()
                        # If it's already in ISO format, keep it as is
            
            return analysis_data
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Response text: {response_text}")
            return []
        except Exception as e:
            print(f"Error parsing AI response: {e}")
            return []

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
