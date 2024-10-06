import 'dart:convert';  // Import for JSON encoding/decoding
import 'package:planpals/core/network/api_service.dart';  // api_service handles HTTP requests
import 'package:planpals/core/constants.dart';
import 'package:planpals/features/travel_planner/models/travel_planner_list_model.dart';
import '../models/travel_planner_model.dart';

class TravelPlannerService {
  final ApiService _apiService = ApiService();

  // Fetch the entire travel planner (flights, accommodations, activities)
  Future<TravelPlanner> fetchTravelPlanner() async {
    try {
      final response = await _apiService.get(Urls.travelPlanner);  // Using URL from constants
      return TravelPlanner.fromJson(json.decode(response.body));  // Assuming 'data' contains the response body
    }
    catch (e) {
      throw Exception("Failed to fetch travel planner");
    }
  }

  // Fetch travel planners by user ID
  Future<TravelPlannerList> fetchTravelPlannersByUserId(String userId) async {

    try {
      final response = await _apiService.get('baseUrl/users/$userId/travelplanners');
      final List<dynamic> jsonList = jsonDecode(response.body);
      return TravelPlannerList.fromJson(jsonList as Map<String, dynamic>);
    }
    catch (e){
      throw Exception("Failed to fetch travel planner by userID=$userId");
    }
  }

}
