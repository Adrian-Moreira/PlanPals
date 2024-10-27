import 'dart:convert'; // Import for JSON encoding/decoding
import 'package:http/http.dart' as http;
import '../constants/constants.dart';

class ApiService {
  final String baseUrl = Urls.baseUrl;

  // GET request
  Future<http.Response> get(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final http.Response response;
    try {
      response = await http.get(url);

      if (response.statusCode == 200) {
        print("SUCCESS: ${response.body}");
        return response;
      } else {
        print(response.body);
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/shared/network/api_service.dart
        print('STATUS CODE: ${response.statusCode}');
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/shared/network/api_service.dart
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
        throw Exception(
            'Failed to load data: ${response.statusCode} - ${response.reasonPhrase}');
      }
    } catch (error) {
      throw Exception('Failed to load data: $error');
    }
  }

  // POST request
  Future<http.Response> post(String endpoint, Map<String, dynamic> jsonData) async {
    final url = Uri.parse('$baseUrl$endpoint');

    try {
      print('jsonData: $jsonData');
      final response = await http.post(
        url,
        body: jsonEncode(jsonData),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      _handleResponse(response);

<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/shared/network/api_service.dart
      print("SUCCESS: Status Code: ${response.statusCode}");

=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/shared/network/api_service.dart
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
      return response;
    } catch (error) {
      throw Exception('Failed to post data: $error');
    }
  }

  // PUT request

  Future<http.Response> patch(String endpoint, Map<String, dynamic> data) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.patch(
        url,
        body: json.encode(data),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      // Check for successful response
      _handleResponse(response);
      return response;
    } catch (error) {
      throw Exception('Failed to update data: $error');
    }
  }

  // DELETE request
  Future<http.Response> delete(String endpoint) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.delete(url);

      // Check for successful response
      _handleResponse(response);
      return response;
    } catch (error) {
      throw Exception('Failed to delete data: $error');
    }
  }

  // Handle HTTP response and throw exceptions for error statuses
  void _handleResponse(http.Response response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      // Handle error responses
      print(response.body);
      throw Exception('Failed to load data: ${response.statusCode}');
    }
  }
}
