import 'dart:convert';
import 'package:planpals/shared/constants/constants.dart';
import 'package:planpals/shared/network/api_service.dart';
import 'package:planpals/features/profile/models/user_model.dart';

class UserService {
  final ApiService _apiService = ApiService();

  // Fetch user details by user ID
  Future<User> fetchUserById(String userId) async {
    final response = await _apiService.get('${Urls.users}/$userId'); // Construct the URL using your constants

    if (response.statusCode == 200) {
      // If the response is successful, parse the JSON
      return User.fromJson(json.decode(response.body));
    } else {
      // If the response is not successful, throw an exception
      throw Exception('Failed to load user: ${response.statusCode}');
    }
  }

  // Fetch user details by userName
  Future<User> fetchUserByUserName(String userName) async {
    final response = await _apiService.get('${Urls.users}/userName/$userName'); // Construct the URL using your constants

    if (response.statusCode == 200) {
      // If the response is successful, parse the JSON
      return User.fromJson(json.decode(response.body));
    } else {
      // If the response is not successful, throw an exception
      throw Exception('Failed to load user: ${response.statusCode}');
    }
  }
}
