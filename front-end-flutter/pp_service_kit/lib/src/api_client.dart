import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class ApiClient {
  final String baseUrl;
  final http.Client httpClient;
  final Map<String, String> defaultHeaders;

  ApiClient({
    required this.baseUrl,
    http.Client? httpClient,
    Map<String, String>? defaultHeaders,
  })  : httpClient = httpClient ?? http.Client(),
        defaultHeaders = defaultHeaders ?? {};

  Future<Response> get(String endpoint,
      {Map<String, String>? headers, Map<String, dynamic>? queryParams}) async {
    final uri =
        Uri.parse('$baseUrl$endpoint').replace(queryParameters: queryParams);
    final response = await httpClient.get(uri, headers: _mergeHeaders(headers));
    _handleErrors(response);
    return response;
  }

  Future<Response> post(String endpoint,
      {Map<String, String>? headers,
      dynamic body,
      Map<String, dynamic>? queryParams}) async {
    final uri =
        Uri.parse('$baseUrl$endpoint').replace(queryParameters: queryParams);
    final response = await httpClient.post(uri,
        headers: _mergeHeaders(headers), body: jsonEncode(body));
    _handleErrors(response);
    return response;
  }

  Future<Response> patch(String endpoint,
      {Map<String, String>? headers,
      dynamic body,
      Map<String, dynamic>? queryParams}) async {
    final uri =
        Uri.parse('$baseUrl$endpoint').replace(queryParameters: queryParams);
    final response = await httpClient.patch(uri,
        headers: _mergeHeaders(headers), body: jsonEncode(body));
    _handleErrors(response);
    return response;
  }

  Future<Response> put(String endpoint,
      {Map<String, String>? headers,
      dynamic body,
      Map<String, dynamic>? queryParams}) async {
    final uri =
        Uri.parse('$baseUrl$endpoint').replace(queryParameters: queryParams);
    final response = await httpClient.put(uri,
        headers: _mergeHeaders(headers), body: jsonEncode(body));
    _handleErrors(response);
    return response;
  }

  Future<Response> delete(String endpoint,
      {Map<String, String>? headers,
      dynamic body,
      Map<String, dynamic>? queryParams}) async {
    final uri =
        Uri.parse('$baseUrl$endpoint').replace(queryParameters: queryParams);
    final response = await httpClient.delete(uri,
        headers: _mergeHeaders(headers), body: jsonEncode(body));
    _handleErrors(response);
    return response;
  }

  Map<String, String> _mergeHeaders(Map<String, String>? headers) {
    return {
      ...defaultHeaders,
      if (headers != null) ...headers,
      'Content-Type': 'application/json',
    };
  }

  void _handleErrors(Response response) {
    if (response.statusCode >= 400) {
      throw ApiException(
          statusCode: response.statusCode, message: response.body);
    }
  }
}

class ApiException implements Exception {
  final int statusCode;
  final String message;

  ApiException({
    required this.statusCode,
    required this.message,
  });

  @override
  String toString() => 'ApiException: HTTP $statusCode = $message';
}
