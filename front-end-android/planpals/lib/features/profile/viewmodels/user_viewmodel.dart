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

  // Fetch user details by userName
  /// Fetches a user by their username.
  Future<void> fetchUserByUserName(String userName) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      print("USERVIEWMODEL: FETCHING USER: $userName");
      _user = await _userService.fetchUserByUserName(userName);
      print('USERVIEWMODEL: FETCHED USER: $_user');
    } on Exception catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add a new destination to the planner
  Future<void> addUser(User user) async {
    try {
      print("USERVIEWMODEL: ADDING USER: $user");
      // Call the service to add the planner
      _user = await _userService.addUser(user);
      print("USERVIEWMODEL: ADDED USER AFTER: $user");

      // Notify listeners about the change in state
      notifyListeners();
    } catch (e) {
      // Handle the exception and throw an error with a meaningful message
      throw Exception('Failed to add destination: $e');
    }
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}
