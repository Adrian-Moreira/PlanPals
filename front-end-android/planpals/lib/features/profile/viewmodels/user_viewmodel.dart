import 'package:flutter/material.dart';
import 'package:planpals/shared/constants/constants.dart';
import 'package:pp_service_kit/pp_service_kit.dart';

class UserViewModel extends ChangeNotifier {
  final UserService _userService =
      UserService(ApiClient(baseUrl: Urls.baseUrl));

  User? _user; // Cached user data
  bool _isLoading = false; // Loading state
  String? _errorMessage; // Error message

  User? get currentUser => _user; // Get the current user
  bool get isLoading => _isLoading; // Get loading state
  String? get errorMessage => _errorMessage; // Get error message

  // Fetch user details by user ID
  Future<void> fetchUserDetails(String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners(); // Notify listeners for UI update

    try {
      _user = await _userService
          .getUserByUserName(userId); // Fetch user from repository
    } catch (error) {
      _errorMessage = error.toString(); // Set error message
    } finally {
      _isLoading = false; // Loading finished
      notifyListeners(); // Notify listeners for UI update
    }
  }

  // Create a function for user login
}
