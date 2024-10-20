import 'dart:convert'; // Import for JSON encoding/decoding
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/location_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/shared/network/api_service.dart'; // api_service handles HTTP requests
import '../models/planner_model.dart';

class PlannerService {
  final ApiService _apiService = ApiService();

  // Fetch the entire travel planner (flights, accommodations, activities)
  Future<List<Planner>> fetchAllPlanners() async {
    try {
      final response = await _apiService.get('/planner');
      final List<dynamic> jsonList = jsonDecode(response.body);

      // Convert the JSON list into a List<Planner>
      return jsonList.map((json) => Planner.fromJson(json)).toList();
    } catch (e) {
      throw Exception("Failed to fetch travel planner");
    }
  }

  // Fetch travel planners by user ID
  Future<List<Planner>> fetchPlannersByUserId(String userId) async {
    try {
      final response = await _apiService.get('/planner?userId=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      print(jsonList);

      // Convert the JSON list into a List<Planner>
      return jsonList.map((json) => Planner.fromJson(json)).toList();
    } catch (e) {
      throw Exception("Failed to fetch travel planners by userID=$userId: $e");
    }
  }

  // Fetch all transportationis by planner ID
  Future<List<Transport>> fetchAllTransportsByUserId(String plannerId, String userId) async {
    try {
      final response =
          await _apiService.get('/planner/$plannerId/transportation?userId=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      return jsonList.map((json) => Transport.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch transportations for planner ID=$plannerId: $e');
    }
  }

  // Fetch all destinations by planner ID
  Future<List<Destination>> fetchAllDestinationsByUserId(String plannerId, String userId) async {
    try {
      final response = await _apiService.get('/planner/$plannerId/destination?userId=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
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
      final response = await _apiService
          .get('/planner/$plannerId/destination/$destinationId/activity');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
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
          '/planner/$plannerId/destination/$destinationId/activity/$activityId/location');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      return jsonList.map((json) => Location.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch locations for planner ID=$plannerId and destinatoin ID=$destinationId and activity ID=$activityId: $e');
    }
  }

  // Add a new planner
  Future<Planner> addPlanner(Planner planner) async {
    try {
      final response = await _apiService.post('/planner', planner.toJson());

      if (response.statusCode != 201) {
        throw Exception('Failed to create the travel planner.');
      }

      final responseBody = jsonDecode(response.body);
      Planner newPlanner = Planner.fromJson(responseBody['data']);
      return newPlanner;
    } catch (e) {
      throw Exception('Failed to create the travel planner: $e');
    }
  }
  // Add a new destination to a specific planner
  Future<Destination> addDestination(Destination destination) async {
    try {
      final response = await _apiService.post(
        '/planner/${destination.plannerId}/destination',
        destination.toJson(),
      );

      final responseBody = jsonDecode(response.body);
      return Destination.fromJson(responseBody['data']);
    } catch (e) {
      print('Error: $e');
      throw Exception('Failed to add destination: $e');
    }
  }

  // Add a new transportation to a specific planner
  Future<Transport> addTransport(Transport transport) async {
    try {
      final response = await _apiService.post(
        '/planner/${transport.plannerId}/transportation',
        transport.toJson(),
      );

      final responseBody = jsonDecode(response.body);
      return Transport.fromJson(responseBody['data']);
    } catch (e) {
      throw Exception('Failed to add transportation: $e');
    }
  }
}
