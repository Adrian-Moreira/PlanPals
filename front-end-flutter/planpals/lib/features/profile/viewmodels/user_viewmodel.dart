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

  //-------------------------------------------
  // FETCH USER
  //-------------------------------------------

  Future<User?> fetchUserByUserName(String userName) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    User? fetchedUser;

    try {
      print("USERVIEWMODEL: FETCHING USER: $userName");
      fetchedUser= await _userService.fetchUserByUserName(userName);
      print('USERVIEWMODEL: FETCHED USER: $_user');
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    return fetchedUser;
  }

  // -------------------------------------------
  // ADD USER
  //-------------------------------------------

  // Add a new destination to the planner
  Future<void> addUser(User user) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      print("USERVIEWMODEL: ADDING USER: $user");
      // Call the service to add the planner
      _user = await _userService.addUser(user);
      print("USERVIEWMODEL: ADDED USER AFTER: $user");

      // Notify listeners about the change in state
      notifyListeners();
    } catch (e) {
      // Handle the exception and throw an error with a meaningful message
      _errorMessage = 'Failed to add user: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  //-------------------------------------------
  // LOGIN LOGOUT
  //-------------------------------------------

  Future<void> login(String userName) async {
    User? fetched = await fetchUserByUserName(userName);
    _user = fetched;
    notifyListeners();
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}
