import 'dart:convert'; // Import for JSON encoding/decoding
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/shared/network/api_service.dart'; // Import your ApiService
import 'package:planpals/shared/constants/constants.dart'; // Import your constants

class TransportService {
  final ApiService _apiService = ApiService();

  // Add a new transport entry for a specific planner
  Future<void> addTransport(String plannerId, Transport transport) async {
    try {
      final response = await _apiService.post(
        '${Urls.travelPlanner}/$plannerId/transportation',
        transport.toJson(),
      );

      // Check if the response was successful
      if (response.statusCode != 200) {
        throw Exception('Failed to add transport: ${response.body}');
      }
    } catch (e) {
      throw Exception('Failed to add transport for planner ID=$plannerId: $e');
    }
  }

  // Fetch all transports for a specific planner, optionally filtered by transport IDs
  Future<List<Transport>> fetchAllTransports(String plannerId,
      {List<String>? transportIds}) async {
    try {
      final url =
          '${Urls.travelPlanner}/$plannerId/transportation${transportIds != null ? '?ids=${transportIds.join(',')}' : ''}';
      final response = await _apiService.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = jsonDecode(response.body);
        return jsonList.map((json) => Transport.fromJson(json)).toList();
      } else {
        throw Exception(
            'Failed to fetch transports for planner ID=$plannerId: ${response.body}');
      }
    } catch (e) {
      throw Exception(
          'Failed to fetch transports for planner ID=$plannerId: $e');
    }
  }
}
