import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .telegram_client import telegram_service

@csrf_exempt
@require_http_methods(["POST"])
def send_verification_code(request):
    """Send verification code to phone number"""
    try:
        data = json.loads(request.body)
        phone_number = data.get('phone_number')
        
        if not phone_number:
            return JsonResponse({
                'success': False,
                'error': 'Phone number is required'
            }, status=400)

        result = telegram_service.send_code_request(phone_number)

        if result['success']:
            return JsonResponse(result)
        else:
            return JsonResponse(result, status=400)

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def verify_code(request):
    """Verify the authentication code"""
    try:
        data = json.loads(request.body)
        phone_number = data.get('phone_number')
        code = data.get('code')
        
        if not phone_number or not code:
            return JsonResponse({
                'success': False,
                'error': 'Phone number and code are required'
            }, status=400)

        result = telegram_service.verify_code(phone_number, code)

        if result['success']:
            # Store user session info
            request.session['user_authenticated'] = True
            request.session['user_data'] = result['user']
            return JsonResponse(result)
        else:
            return JsonResponse(result, status=400)

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def check_authentication(request):
    """Check if user is authenticated"""
    try:
        is_authenticated = telegram_service.is_user_authenticated()

        return JsonResponse({
            'success': True,
            'is_authenticated': is_authenticated,
            'user_data': request.session.get('user_data', None)
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_groups(request):
    """Get all groups/chats"""
    try:
        result = telegram_service.get_groups()

        if result['success']:
            return JsonResponse(result)
        else:
            return JsonResponse(result, status=400)

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_messages(request, group_id):
    """Get messages from a specific group"""
    try:
        limit = int(request.GET.get('limit', 100))
        
        result = telegram_service.get_messages(group_id, limit)

        if result['success']:
            return JsonResponse(result)
        else:
            return JsonResponse(result, status=400)

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def logout(request):
    """Logout user and disconnect Telegram client"""
    try:
        telegram_service.disconnect()

        # Clear session
        request.session.flush()

        return JsonResponse({
            'success': True,
            'message': 'Logged out successfully'
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
