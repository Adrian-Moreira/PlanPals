import 'dart:convert'; // Import for JSON encoding/decoding
import 'package:http/http.dart' as http;
import '../constants.dart';

class ApiService {
  final String baseUrl = Urls.baseUrl;

  // GET request
  Future<http.Response> get(String endpoint) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.get(url);

      // Check for successful response
      _handleResponse(response);
      return response;
    } catch (error) {
      throw Exception('Failed to load data: $error');
    }
  }

  // POST request
  Future<http.Response> post(String endpoint, Map<String, dynamic> data) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.post(
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
      throw Exception('Failed to post data: $error');
    }
  }

  // PUT request
  Future<http.Response> put(String endpoint, Map<String, dynamic> data) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.put(
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
    if (response.statusCode != 200) {
      throw Exception('Error: ${response.statusCode} - ${response.body}');
    }
  }
}
