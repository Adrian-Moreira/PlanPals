import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/lists/travel_planner_list_model.dart';
import 'package:planpals/features/travel_planner/models/travel_planner_model.dart';
import 'package:planpals/features/travel_planner/services/travel_planner_service.dart';

class TravelPlannerViewModel extends ChangeNotifier {
  final TravelPlannerService _travelPlannerService = TravelPlannerService();

  TravelPlanner? travelPlanner;
  TravelPlannerList? travelPlanners;
  String? errorMessage;
  bool isLoading = false;

  // Fetch the travel planner
  Future<void> fetchTravelPlanner() async {
    isLoading = true;
    notifyListeners();

    try {
      travelPlanner = await _travelPlannerService.fetchTravelPlanner();
      errorMessage = null;  // Clear any previous errors
    } catch (e) {
      errorMessage = 'Failed to load travel planner: $e';
      travelPlanner = null;  // Clear the data on error
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // Fetch travel planners by user ID
  Future<void> fetchTravelPlannersByUserId(String userId) async {
    isLoading = true;
    notifyListeners();

    try {
      travelPlanners = await _travelPlannerService.fetchTravelPlannersByUserId(userId);
      errorMessage = null;
    } catch (error) {
      errorMessage = 'Failed to load travel planners';
      travelPlanners = null;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // Future<void> addTravelPlanner(TravelPlanner planner) async {
  //   isLoading = true;
  //   notifyListeners();

  //   try {
  //     await _travelPlannerService.addTravelPlanner(planner);

  //     travelPlanners = await _travelPlannerService.fetchTravelPlannersByUserId(planner.userId);
  //     errorMessage = null;
  //   }
  //   catch (e) {
  //     errorMessage = "Failed to add travel planner or load planners";
  //     travelPlanners = null;
  //   }
  //   finally {
  //     isLoading = false;
  //     notifyListeners();
  //   }
  // }

    Future<void> addTravelPlanner(TravelPlanner planner) async {
      return;
    }

}

