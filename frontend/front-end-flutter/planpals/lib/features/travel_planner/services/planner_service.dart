import 'dart:convert'; // Import for JSON encoding/decoding
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/location_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/shared/network/api_service.dart'; // api_service handles HTTP requests
import '../models/planner_model.dart';

class PlannerService {
  final ApiService _apiService = ApiService();

  // ------------------------------------------
  // FETCHERS
  // ------------------------------------------

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
  Future<List<Transport>> fetchAllTransportsByUserId(
      String plannerId, String userId) async {
    try {
      final response = await _apiService
          .get('/planner/$plannerId/transportation?userId=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      return jsonList.map((json) => Transport.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch transportations for planner ID=$plannerId: $e');
    }
  }

  // Fetch all destinations by planner ID
  Future<List<Destination>> fetchAllDestinationsByUserId(
      String plannerId, String userId) async {
    try {
      print('Fetching all destinations for planner ID=$plannerId');
      final response = await _apiService
          .get('/planner/$plannerId/destination?userId=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      return jsonList.map((json) => Destination.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch destinations for planner ID=$plannerId: $e');
    }
  }

  // Fetch all destinations by planner ID and destination ID
  Future<List<Activity>> fetchActivitiesByDestinationId(
      String plannerId, String destinationId, String userId) async {
    try {
      final response = await _apiService.get(
          '/planner/$plannerId/destination/$destinationId/activity?userId=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      return jsonList.map((json) => Activity.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch activities for planner ID=$plannerId and destinatoin ID=$destinationId: $e');
    }
  }

  // Fetch all accommodations by planner ID and destination ID
  Future<List<Accommodation>> fetchAccommodationsByDestinationId(
      String plannerId, String destinationId, String userId) async {
    try {
      final response = await _apiService.get(
          '/planner/$plannerId/destination/$destinationId/accommodation?userId=$userId');
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      return jsonList.map((json) => Accommodation.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          'Failed to fetch accommodations for planner ID=$plannerId and destination ID=$destinationId: $e');
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

  // ------------------------------------------
  // ADDERS
  // ------------------------------------------

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

  // Add a new activity to a specific destination
  Future<Activity> addActivity(
      Activity activity, String plannerId, String userId) async {
    try {
      final response = await _apiService.post(
        '/planner/$plannerId/destination/${activity.destinationId}/activity?userId=$userId',
        activity.toJson(),
      );

      final responseBody = jsonDecode(response.body);
      return Activity.fromJson(responseBody['data']);
    } catch (e) {
      throw Exception('Failed to add activity: $e');
    }
  }

  // Add a new accommodation to a specific destination
  Future<Accommodation> addAccommodation(
      Accommodation accommodation, String plannerId, String userId) async {
    try {
      final response = await _apiService.post(
        '/planner/$plannerId/destination/${accommodation.destinationId}/accommodation?userId=$userId',
        accommodation.toJson(),
      );

      final responseBody = jsonDecode(response.body);
      return Accommodation.fromJson(responseBody['data']);
    } catch (e) {
      throw Exception('Failed to add accommodation: $e');
    }
  }

  // ------------------------------------------
  // UPDATERS
  // ------------------------------------------

  Future<Planner> updatePlanner(Planner planner, String userId) async {
    try {
      final response = await _apiService.patch(
        '/planner/${planner.plannerId}',
        planner.toJson(),
      );

      final responseBody = jsonDecode(response.body);
      return Planner.fromJson(responseBody['data']);
    } catch (e) {
      throw Exception('Failed to update the travel planner: $e');
    }
  }

  Future<Destination> updateDestination(
      Destination destination, String userId) async {
    try {
      print('UPDATING DESTINATION: $destination');
      final response = await _apiService.patch(
        '/planner/${destination.plannerId}/destination/${destination.destinationId}?userId=$userId',
        destination.toJson(),
      );

      final responseBody = jsonDecode(response.body);
      return Destination.fromJson(responseBody['data']);
    } catch (e) {
      throw Exception('Failed to update the destination: $e');
    }
  }

  Future<Transport> updateTransport(Transport transport, String userId) async {
    try {
      final response = await _apiService.patch(
        '/planner/${transport.plannerId}/transportation/${transport.id}?userId=$userId',
        transport.toJson(),
      );

      final responseBody = jsonDecode(response.body);
      return Transport.fromJson(responseBody['data']);
    } catch (e) {
      throw Exception('Failed to update the transportation: $e');
    }
  }

  Future<Accommodation> updateAccommodation(
      Accommodation accommodation, String plannerId, String userId) async {
    try {
      print('UPDATING ACCOMMODATION: $accommodation');
      final response = await _apiService.patch(
        '/planner/$plannerId/destination/${accommodation.destinationId}/accommodation/${accommodation.accommodationId}?userId=$userId',
        accommodation.toJson(),
      );

      final responseBody = jsonDecode(response.body);
      return Accommodation.fromJson(responseBody['data']);
    } catch (e) {
      print(e);
      throw Exception('Failed to update the accommodation: $e');
    }
  }

  Future<Activity> updateActivity(
      Activity activity, String plannerId, String userId) async {
    try {
      final response = await _apiService.patch(
        '/planner/$plannerId/destination/${activity.destinationId}/activity/${activity.activityId}?userId=$userId',
        activity.toJson(),
      );

      final responseBody = jsonDecode(response.body);
      return Activity.fromJson(responseBody['data']);
    } catch (e) {
      throw Exception('Failed to update the activity: $e');
    }
  }

  // ------------------------------------------
  // DELETERS
  // ------------------------------------------

  Future<void> deletePlanner(Planner planner, String userId) async {
    try {
      await _apiService.delete('/planner/${planner.plannerId}?userId=$userId');
    } catch (e) {
      throw Exception('Failed to delete the travel planner: $e');
    }
  }

  Future<void> deleteDestination(Destination destination, String userId) async {
    try {
      await _apiService.delete(
          '/planner/${destination.plannerId}/destination/${destination.destinationId}?userId=$userId');
    } catch (e) {
      throw Exception('Failed to delete the destination: $e');
    }
  }

  Future<void> deleteTransport(Transport transport, String userId) async {
    try {
      await _apiService.delete(
          '/planner/${transport.plannerId}/transportation/${transport.id}?userId=$userId');
    } catch (e) {
      throw Exception('Failed to delete the transportation: $e');
    }
  }

  Future<void> deleteAccommodation(
      Accommodation accommodation, String plannerId, String userId) async {
    try {
      await _apiService.delete(
          '/planner/$plannerId/destination/${accommodation.destinationId}/accommodation/${accommodation.accommodationId}?userId=$userId');
    } catch (e) {
      throw Exception('Failed to delete the accommodation: $e');
    }
  }

  Future<void> deleteActivity(
      Activity activity, String plannerId, String userId) async {
    try {
      await _apiService.delete(
          '/planner/$plannerId/destination/${activity.destinationId}/activity/${activity.activityId}?userId=$userId');
    } catch (e) {
      throw Exception('Failed to delete the activity: $e');
    }
  }


  Future<void> inviteUserToPlanner(String plannerId, String userId) async {
    try {
      await _apiService.post('/planner/$plannerId/invite/', {'userId': userId});
    } catch (e) {
      throw Exception('Failed to invite user to planner');
    }
  }
}
