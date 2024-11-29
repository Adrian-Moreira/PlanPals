import 'dart:convert'; // Import for JSON encoding/decoding
import 'package:planpals/shared/network/api_service.dart'; // Import your ApiService
import 'package:planpals/features/travel_planner/models/accommodation_model.dart'; // Import your Accommodation model
import 'package:planpals/shared/constants/constants.dart'; // Import your constants

class AccommodationService {
  final ApiService _apiService = ApiService();

  // Fetch accommodations for a specific destination within a planner
  Future<List<Accommodation>> fetchAccommodations(
      String plannerId, String destinationId) async {
    try {
      final response = await _apiService.get(
          '${Urls.travelPlanner}/$plannerId/destination/$destinationId/accommodation');
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Accommodation.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          "Failed to fetch accommodations for planner ID=$plannerId and destination ID=$destinationId");
    }
  }

  // Add a new accommodation for a specific destination within a planner
  Future<void> addAccommodation(String plannerId, String destinationId,
      Accommodation accommodation) async {
    try {
      await _apiService.post(
          '${Urls.travelPlanner}/$plannerId/destination/$destinationId/accommodation',
          accommodation.toJson());
    } catch (e) {
      throw Exception(
          'Failed to add accommodation for planner ID=$plannerId and destination ID=$destinationId');
    }
  }

  // Update an existing accommodation for a specific destination within a planner
  Future<void> updateAccommodation(String plannerId, String destinationId,
      String accommodationId, Accommodation accommodation) async {
    try {
      await _apiService.patch(
          '${Urls.travelPlanner}/$plannerId/destination/$destinationId/accommodation/$accommodationId',
          accommodation.toJson());
    } catch (e) {
      throw Exception(
          'Failed to update accommodation ID=$accommodationId for planner ID=$plannerId and destination ID=$destinationId');
    }
  }
}
