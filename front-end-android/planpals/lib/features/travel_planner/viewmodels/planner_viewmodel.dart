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
  List<Planner> _planners = [];
  List<Destination> _destinations = [];
  List<Activity> _activities = [];
  List<Transport> _transports = [];
  List<Location> _locations = [];
  bool _isLoading = false;
  String? _errorMessage;

  // Getters
  List<Planner> get planners => _planners;
  List<Destination> get destinations => _destinations;
  List<Activity> get activities => _activities;
  List<Transport> get transports => _transports;
  List<Location> get locations => _locations;
  bool get isLoading => _isLoading; // Get loading state
  String? get errorMessage => _errorMessage; // Get error message

  // Fetch all planners by user ID
  Future<void> fetchAllPlanners() async {
    _isLoading = true;
    _planners = [];
    notifyListeners(); // Notify listeners about the loading state

    print('PLANNERVIEWMODEL: FETCHING ALL PLANNERS');

    try {
      _planners = await _plannerService.fetchAllPlanners();
      _errorMessage = null; // Clear any previous error message
    } catch (e) {
      _errorMessage = e.toString(); // Store error message
    } finally {
      _isLoading = false; // Set loading to false
      notifyListeners(); // Notify listeners about the loading state change
    }
  }

  // Fetch all planners by user ID
  Future<void> fetchPlannersByUserId(String userId) async {
    _isLoading = true;
    _planners = [];
    notifyListeners(); // Notify listeners about the loading state

    print('Fetching Planners by userid:$userId)');

    try {
      _planners = await _plannerService.fetchPlannersByUserId(userId);
      print('PLANNERS: $_planners');
      _errorMessage = null; // Clear any previous error message
    } catch (e) {
      _errorMessage = e.toString(); // Store error message
    } finally {
      _isLoading = false; // Set loading to false
      notifyListeners(); // Notify listeners about the loading state change
    }
  }

  // Fetch all transports by planner ID
  Future<void> fetchAllTransportsByUserId(String plannerId, String userId) async {
    _isLoading = true;
    _transports = [];
    notifyListeners();

    try {
      print('PLANNERVIEWMODEL: FETCHING ALL TRANSPORTS: $plannerId');
      _transports = await _plannerService.fetchAllTransportsByUserId(plannerId, userId);
      print('PLANNERVIEWMODEL: FETCHED ALL TRANSPORTS by plannerId: $plannerId');
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Fetch all destinations by planner ID and User ID
  Future<void> fetchAllDestinationsByUserId(String plannerId, String userId) async {
    _isLoading = true;
    _destinations = [];
    notifyListeners();

    try {
      _destinations = await _plannerService.fetchAllDestinationsByUserId(plannerId, userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Fetch all activities by planner ID and destination ID
  Future<void> fetchAllActivities(
      String plannerId, String destinationId) async {
    _isLoading = true;
    _activities = [];
    notifyListeners();

    try {
      _activities =
          await _plannerService.fetchAllActivities(plannerId, destinationId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Fetch all locations by planner ID, destination ID, and activity ID
  Future<void> fetchAllLocations(
      String plannerId, String destinationId, String activityId) async {
    _isLoading = true;
    _locations = [];
    notifyListeners();

    try {
      _locations = await _plannerService.fetchAllLocations(
          plannerId, destinationId, activityId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add a new destination to the planner
  Future<Planner> addPlanner(Planner planner) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Planner newPlanner = planner;
    try {
      newPlanner = await _plannerService.addPlanner(newPlanner);
      _planners.add(newPlanner); // Add to local state if successful
    } catch (e) {
      _errorMessage = 'Failed to add planner: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return newPlanner;
  }

  // Add a new destination to the planner
  Future<Destination> addDestination(
      String plannerId, Destination destination) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Destination newDestination = destination;
    try {
      print("PLANNERVIEWMODEL: ADDING DESTINATION: $newDestination");
      newDestination =
          await _plannerService.addDestination(plannerId, newDestination);
      _destinations.add(newDestination); // Add to local state if successful
            print("PLANNERVIEWMODEL: ADDED DESTINATION: $newDestination");

      notifyListeners(); // Notify listeners about the change
    } catch (e) {
      _errorMessage = 'Failed to add destination: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return newDestination;
  }

  // Add a new transporation to the planner
  Future<Transport> addTransport(String plannerId, Transport transport) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Transport newTransport = transport;
    try {
      print("PLANNERVIEWMODEL: ADDING TRANSPORT: $newTransport");
      newTransport =
          await _plannerService.addTransport(plannerId, newTransport);

      print('PLANNERVIEWMODEL: ADDED TRANSPORT: $newTransport');
      _transports.add(newTransport); // Add to local state if successful
      notifyListeners(); // Notify listeners about the change
    } catch (e) {
      _errorMessage = 'Failed to add transportation: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return newTransport;
  }

  void logout() {
    _planners = [];
    _destinations = [];
    _activities = [];
    _transports = [];
    _locations = [];
    _errorMessage = null;
    notifyListeners();
  }
}
