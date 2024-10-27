import 'dart:convert';

import 'package:pp_service_kit/pp_service_kit.dart';

class UserService {
  final ApiClient _client;

  UserService(this._client);

  Future<User> getUserByUserName(String userName) async {
    final response = await _client.get('/user/search', queryParams: {
      'userName': userName,
    });
    ApiResponse<User> userData = ApiResponse<User>.fromJson(
        jsonDecode(response.body),
        (j) => User.fromJson(j as Map<String, dynamic>));
    return userData.data;
  }

  Future<User> getUserByUserId(String userId) async {
    final response = await _client.get('/user/$userId');
    ApiResponse<User> userData = ApiResponse<User>.fromJson(
        jsonDecode(response.body),
        (j) => User.fromJson(j as Map<String, dynamic>));
    return userData.data;
  }

  Future<User> addUser(User user) async {
    final response = await _client.post(
      'user',
      body: jsonEncode(user),
    );
    ApiResponse<User> userData = ApiResponse<User>.fromJson(
        jsonDecode(response.body),
        (j) => User.fromJson(j as Map<String, dynamic>));
    return userData.data;
  }

  Future<User> updateUser(User user) async {
    final response = await _client.patch('user', body: jsonEncode(user));
    ApiResponse<User> userData = ApiResponse<User>.fromJson(
        jsonDecode(response.body),
        (j) => User.fromJson(j as Map<String, dynamic>));
    return userData.data;
  }
}
