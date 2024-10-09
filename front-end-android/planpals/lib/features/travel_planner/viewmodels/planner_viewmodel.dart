import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/location_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/services/planner_service.dart';

class PlannerViewModel extends ChangeNotifier {
  final PlannerService _plannerService = PlannerService();

  // State variables for the UI
  List<Planner> planners = [];
  List<Destination> destinations = [];
  List<Activity> activities = [];
  List<Transport> transports = [];
  List<Location> locations = [];
  
  bool isLoading = false;
  String? errorMessage;

  // Fetch all planners by user ID
  Future<void> fetchPlannersByUserId(String userId) async {
    isLoading = true;
    notifyListeners(); // Notify listeners about the loading state

    try {
      planners = await _plannerService.fetchPlannersByUserId(userId);
      errorMessage = null; // Clear any previous error message
    } catch (e) {
      errorMessage = e.toString(); // Store error message
    } finally {
      isLoading = false; // Set loading to false
      notifyListeners(); // Notify listeners about the loading state change
    }
  }

  // Fetch all transports by planner ID
  Future<void> fetchAllTransports(String plannerId) async {
    isLoading = true;
    notifyListeners();

    try {
      transports = await _plannerService.fetchAllTransports(plannerId);
      errorMessage = null;
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // Fetch all destinations by planner ID
  Future<void> fetchAllDestinations(String plannerId) async {
    isLoading = true;
    notifyListeners();

    try {
      destinations = await _plannerService.fetchAllDestinations(plannerId);
      errorMessage = null;
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // Fetch all activities by planner ID and destination ID
  Future<void> fetchAllActivities(String plannerId, String destinationId) async {
    isLoading = true;
    notifyListeners();

    try {
      activities = await _plannerService.fetchAllActivities(plannerId, destinationId);
      errorMessage = null;
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // Fetch all locations by planner ID, destination ID, and activity ID
  Future<void> fetchAllLocations(String plannerId, String destinationId, String activityId) async {
    isLoading = true;
    notifyListeners();

    try {
      locations = await _plannerService.fetchAllLocations(plannerId, destinationId, activityId);
      errorMessage = null;
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // Add a new destination to the planner
  Future<void> addDestination(String plannerId, Destination destination) async {
    try {
      await _plannerService.addDestination(plannerId, destination);
      destinations.add(destination); // Add to local state if successful
      notifyListeners(); // Notify listeners about the change
    } catch (e) {
      // Handle error (e.g., show a message)
      throw Exception('Failed to add destination: $e');
    }
  }

  // Add a new transporation to the planner
  Future<void> addTransport(String plannerId, Transport transport) async {
    try {
      await _plannerService.addTransport(plannerId, transport);
      transports.add(transport); // Add to local state if successful
      notifyListeners(); // Notify listeners about the change
    } catch (e) {
      // Handle error (e.g., show a message)
      throw Exception('Failed to add destination: $e');
    }
  }

}
