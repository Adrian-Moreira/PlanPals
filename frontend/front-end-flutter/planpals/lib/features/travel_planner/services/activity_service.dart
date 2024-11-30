import 'dart:convert'; // Import for JSON encoding/decoding
import 'package:planpals/shared/network/api_service.dart'; // Import your ApiService
import 'package:planpals/features/travel_planner/models/activity_model.dart'; // Import your Activity model
import 'package:planpals/shared/constants/constants.dart'; // Import your constants

class ActivityService {
  final ApiService _apiService = ApiService();

  // Fetch activities for a specific destination within a planner
  Future<List<Activity>> fetchActivities(
      String plannerId, String destinationId) async {
    try {
      final response = await _apiService.get(
          '${Urls.travelPlanner}/$plannerId/destination/$destinationId/activity');
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Activity.fromJson(json)).toList();
    } catch (e) {
      throw Exception(
          "Failed to fetch activities for planner ID=$plannerId and destination ID=$destinationId");
    }
  }

  // Add a new activity for a specific destination within a planner
  Future<void> addActivity(
      String plannerId, String destinationId, Activity activity) async {
    try {
      await _apiService.post(
          '${Urls.travelPlanner}/$plannerId/destination/$destinationId/activity',
          activity.toJson());
    } catch (e) {
      throw Exception(
          'Failed to add activity for planner ID=$plannerId and destination ID=$destinationId');
    }
  }

  // Update an existing activity for a specific destination within a planner
  Future<void> updateActivity(String plannerId, String destinationId,
      String activityId, Activity activity) async {
    try {
      await _apiService.patch(
          '${Urls.travelPlanner}/$plannerId/destination/$destinationId/activity/$activityId',
          activity.toJson());
    } catch (e) {
      throw Exception(
          'Failed to update activity ID=$activityId for planner ID=$plannerId and destination ID=$destinationId');
    }
  }
}
