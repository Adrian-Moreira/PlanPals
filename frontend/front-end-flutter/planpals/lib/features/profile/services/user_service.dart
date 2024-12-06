import 'dart:convert';
import 'package:planpals/shared/network/api_service.dart';
import 'package:planpals/features/profile/models/user_model.dart';

class UserService {
  final ApiService _apiService = ApiService();

  // Fetch user details by userName
  /// Fetches a user by their username.
  Future<User> fetchUserByUserName(String userName) async {
    final response = await _apiService.get('/user/search?userName=$userName');

    if (response.statusCode == 200) {
      final userJson = json.decode(response.body);
      return User.fromJson(userJson['data']);
    } else {
      throw Exception('Failed to load user: ${response.statusCode}');
    }
  }

  Future<User> fetchUserById(String userId) async {
    final response = await _apiService.get('/user/$userId');
    if (response.statusCode == 200) {
      final userJson = json.decode(response.body);
      return User.fromJson(userJson['data']);
    } else {
      throw Exception('Failed to load user: ${response.statusCode}');
    }
  }

  Future<User> addUser(User user) async {
    try {
      final response = await _apiService.post('/user', user.toJson());

      if (response.statusCode == 201) {
        final userData = json.decode(response.body);
        return User.fromJson(userData);
      } else {
        throw Exception('Failed to add user: ${response.statusCode}');
      }
    } on Exception catch (e) {
      throw Exception('Failed to add user: $e');
    }
  }
}
