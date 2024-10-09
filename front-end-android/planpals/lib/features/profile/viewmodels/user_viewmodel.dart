import 'package:flutter/material.dart';
import 'package:planpals/features/profile/services/user_service.dart';
import '../models/user_model.dart'; // Import your user model

class UserViewModel extends ChangeNotifier {
  final UserService _userService = UserService();

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
      _user = await _userService.fetchUserById(userId); // Fetch user from repository
    } catch (error) {
      _errorMessage = error.toString(); // Set error message
    } finally {
      _isLoading = false; // Loading finished
      notifyListeners(); // Notify listeners for UI update
    }
  }

  // Create a function for user login
}
