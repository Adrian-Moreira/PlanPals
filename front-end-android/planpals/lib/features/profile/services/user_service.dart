import 'dart:convert';
import 'package:planpals/shared/constants/constants.dart';
import 'package:planpals/shared/network/api_service.dart';
import 'package:planpals/features/profile/models/user_model.dart';

class UserService {
  final ApiService _apiService = ApiService();

  // Fetch user details by userName
  Future<User> fetchUserByUserName(String userName) async {
    print('USER SERVICE: FETCHING USER: $userName');
    final response = await _apiService.get('/user/search?userName=$userName'); // Construct the URL using your constants
    print('USER SERVICE: FETCHING USER AFTER: $userName');
    
    print("RESPONSE: ${response.statusCode}");
    User user;
    if (response.statusCode == 200) {
      // If the response is successful, parse the JSON
      print("IFFFFFFFFFFFFFFFFF"); 
      user = User.fromJson(json.decode(response.body));
      print("IFFFFFFFFFFFFFFFFF AFTERRRRRRRRR"); 
    } else {
      // If the response is not successful, throw an exception
      print("EXCEPTION");
      throw Exception('Failed to load user: ${response.statusCode}');
    }
    return user;
  }
}
