import 'dart:convert';

import 'package:http/testing.dart';
import 'package:pp_service_kit/pp_service_kit.dart';
import 'package:test/test.dart';
import 'package:http/http.dart' as http;

void main() {
  group('Search for user', () {
    final String baseUrl = 'baseUrl';
    final User testUser =
        User(id: '123', userName: 'jdoe', preferredName: 'John Doe');
    final testUserJSON = testUser.toJson();

    test('get method constructs correct URL with query params', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, equals('GET'));
        expect(request.url.toString(),
            equals('$baseUrl/user/search?userName=jdoe'));

        return http.Response(
            '{"success": true, "data": ${jsonEncode(testUserJSON)} }', 200);
      });

      final apiClient = ApiClient(baseUrl: baseUrl, httpClient: mockClient);
      final userService = UserService(apiClient);
      expect(await userService.getUserByUserName(testUser.userName), testUser);
    });
  });
}
