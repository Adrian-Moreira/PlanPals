import 'dart:convert'; // Import for JSON encoding/decoding
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/location_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/shared/network/api_service.dart'; // api_service handles HTTP requests
import 'package:planpals/shared/constants/constants.dart';
import '../models/planner_model.dart';

class PlannerService {
  final ApiService _apiService = ApiService();
  String? _errorMessage;

  // Fetch the entire travel planner (flights, accommodations, activities)
  Future<Planner> fetchPlanner() async {
    try {
      final response =
          await _apiService.get(Urls.travelPlanner); // Using URL from constants
      return Planner.fromJson(json
          .decode(response.body)); // Assuming 'data' contains the response body
    } catch (e) {
      throw Exception("Failed to fetch travel planner");
    }
  }

  // Fetch travel planners by user ID
  Future<List<Planner>> fetchPlannersByUserId(String userId) async {
    try {
      final response =
          await _apiService.get('baseUrl/planner?createdBy=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body);

      // Convert the JSON list into a List<Planner>
      return jsonList.map((json) => Planner.fromJson(json)).toList();
    } catch (e) {
      throw Exception("Failed to fetch travel planners by userID=$userId: $e");
    }
  }

  // Add a new planner
  Future<void> addPlanner(Planner planner) async {
    try {
      final response =
          await _apiService.post(EndPoints.travelPlanner, planner.toJson());
      if (response.statusCode != 201) {
        throw Exception('Failed to create the travel planner.');
      }
    } catch (e) {
      throw Exception('Failed to create the travel planner: $e');
    }
  }

  // Fetch all transportationis by planner ID
  Future<List<Transport>> fetchAllTransports(String plannerId) async {
    try {
      final response = await _apiService
          .get('${Urls.travelPlanner}/$plannerId/transportation');
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Transport.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch transportations for planner ID=$plannerId: $e');
    }
  }

  // Fetch all destinations by planner ID
  Future<List<Destination>> fetchAllDestinations(String plannerId) async {
    try {
      final response =
          await _apiService.get('${Urls.travelPlanner}/$plannerId/destination');
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Destination.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch destinations for planner ID=$plannerId: $e');
    }
  }

  // Fetch all destinations by planner ID and destination ID
  Future<List<Activity>> fetchAllActivities(
      String plannerId, String destinationId) async {
    try {
      final response = await _apiService.get(
          '${Urls.travelPlanner}/$plannerId/destination/$destinationId/activity');
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Activity.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch activities for planner ID=$plannerId and destinatoin ID=$destinationId: $e');
    }
  }

  // Fetch all destinations by planner ID and destination ID and activity ID
  Future<List<Location>> fetchAllLocations(
      String plannerId, String destinationId, String activityId) async {
    try {
      final response = await _apiService.get(
          '${Urls.travelPlanner}/$plannerId/destination/$destinationId/activity/$activityId/location');
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Location.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch locations for planner ID=$plannerId and destinatoin ID=$destinationId and activity ID=$activityId: $e');
    }
  }

  // Add a new destination to a specific planner
  Future<void> addDestination(String plannerId, Destination destination) async {
    try {
      await _apiService.post(
        '${Urls.travelPlanner}/$plannerId/destination', destination.toJson(),
      );
    } catch (e) {
      throw Exception('Failed to add destination: $e');
    }
  }

  // Add a new transportation to a specific planner
  Future<void> addTransport(String plannerId, Transport transport) async {
    try {
      await _apiService.post(
        '${Urls.travelPlanner}/$plannerId/transportation', transport.toJson(),
      );
    } catch (e) {
      throw Exception('Failed to add transportation: $e');
    }
  }
}
