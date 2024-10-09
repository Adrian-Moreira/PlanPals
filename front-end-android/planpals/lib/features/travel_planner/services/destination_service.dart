import 'dart:convert';  // Import for JSON encoding/decoding
import 'package:planpals/shared/network/api_service.dart';  // Import your ApiService
import 'package:planpals/features/travel_planner/models/destination_model.dart';  // Import your Destination model
import 'package:planpals/shared/constants/constants.dart';  // Import your constants

class DestinationService {
  final ApiService _apiService = ApiService();

  // Fetch destinations for a specific planner by plannerId
  Future<List<Destination>> fetchDestinations(String plannerId) async {
    try {
      final response = await _apiService.get('${Urls.travelPlanner}/$plannerId/destination');
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Destination.fromJson(json)).toList();
    } catch (e) {
      throw Exception("Failed to fetch destinations for planner ID=$plannerId");
    }
  }

  // Add a new destination for a specific planner by plannerId
  Future<void> addDestination(String plannerId, Destination destination) async {
    try {
      await _apiService.post('${Urls.travelPlanner}/$plannerId/destination', destination.toJson());
    } catch (e) {
      throw Exception('Failed to add destination for planner ID=$plannerId');
    }
  }

  // Update an existing destination for a specific planner by plannerId
  Future<void> updateDestination(String plannerId, String destinationId, Destination destination) async {
    try {
      await _apiService.put('${Urls.travelPlanner}/$plannerId/destination/$destinationId', destination.toJson());
    } catch (e) {
      throw Exception('Failed to update destination ID=$destinationId for planner ID=$plannerId');
    }
  }
}
