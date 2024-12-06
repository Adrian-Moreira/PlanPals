import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/services/planner_service.dart';

class PlannerViewModel extends ChangeNotifier {
  final PlannerService _plannerService = PlannerService();

  // State variables for the UI
  List<Planner> _planners = [];
  List<Destination> _destinations = [];
  List<Activity> _activities = [];
  List<Transport> _transports = [];
  List<Accommodation> _accommodations = [];
  bool _isLoading = false;
  String? _errorMessage;

  // Getters
  List<Planner> get planners => _planners;
  List<Destination> get destinations => _destinations;
  List<Transport> get transports => _transports;
  List<Accommodation> get accommodations => _accommodations;
  List<Activity> get activities => _activities;
  bool get isLoading => _isLoading; // Get loading state
  String? get errorMessage => _errorMessage; // Get error message


  // ----------------------------------------
  // FETCHERS
  // ----------------------------------------

  // Fetch all planners by user ID
  Future<void> fetchAllPlanners() async {
    _isLoading = true;
    _planners = [];
    notifyListeners(); // Notify listeners about the loading state

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

    try {
      _planners = await _plannerService.fetchPlannersByUserId(userId);
      _errorMessage = null; // Clear any previous error message
    } catch (e) {
      _errorMessage = e.toString(); // Store error message
    } finally {
      _isLoading = false; // Set loading to false
      notifyListeners(); // Notify listeners about the loading state change
    }
  }

  Future<void> fetchDestinationsAndTransportsByPlannerId(String plannerId, String userId) async {
    _isLoading = true;
    _transports = [];
    _destinations = [];
    notifyListeners();

    try {
      _transports = await _plannerService.fetchAllTransportsByUserId(plannerId, userId);
      _destinations = await _plannerService.fetchAllDestinationsByUserId(plannerId, userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = "Failed to fetch destinations and transports";
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Fetch all transports by planner ID
  Future<void> fetchTransportsByPlannerId(String plannerId, String userId) async {
    _isLoading = true;
    _transports = [];
    notifyListeners();

    try {
      _transports = await _plannerService.fetchAllTransportsByUserId(plannerId, userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Fetch all destinations by planner ID and User ID
  Future<void> fetchDestinationsByPlannerId(String plannerId, String userId) async {
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
  Future<List<Activity>> fetchActivitiesByDestinationId(
      String plannerId, String destinationId, String userId) async {
    _isLoading = true;
    _activities = [];
    notifyListeners();

    try {
      _activities =
          await _plannerService.fetchActivitiesByDestinationId(plannerId, destinationId, userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    return _activities;
  }

  // Fetch all accommodations by planner ID and destination ID
  Future<List<Accommodation>> fetchAccommodationsByDestinationId(
      String plannerId, String destinationId, String userId) async {
    _isLoading = true;
    _accommodations = [];
    notifyListeners();

    try {
      _accommodations =
          await _plannerService.fetchAccommodationsByDestinationId(plannerId, destinationId, userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return _accommodations;
  }



  // ----------------------------------------
  // ADDERS
  // ----------------------------------------

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
  Future<Destination> addDestination(Destination destination) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Destination newDestination = destination;
    try {
      newDestination =
          await _plannerService.addDestination(newDestination);
      _destinations.add(newDestination); // Add to local state if successful

      notifyListeners(); // Notify listeners about the change
    } catch (e) {
      _errorMessage = 'Failed to add destination.}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return newDestination;
  }

  // Add a new transporation to the planner
  Future<Transport> addTransport(Transport transport) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Transport newTransport = transport;
    try {
      newTransport =
          await _plannerService.addTransport(newTransport);
      _transports.add(newTransport); // Add to local state if successful
      notifyListeners(); // Notify listeners about the change
    } catch (e) {
      _errorMessage = 'Failed to add transportation.}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return newTransport;
  }

  Future<Accommodation?> addAccommodation(Accommodation accommodation, String plannerId, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Accommodation? newAccommodation;
    try {
      newAccommodation = await _plannerService.addAccommodation(accommodation, plannerId, userId);
      _accommodations.add(newAccommodation); // Add to local state if successful
      notifyListeners(); // Notify listeners about the change
    } catch (e) {
      _errorMessage = 'Failed to add activity: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return newAccommodation;
  }

  Future<Activity?> addActivity(Activity activity, String plannerId, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message1
    notifyListeners();

    Activity? newActivity;
    try {
      newActivity = await _plannerService.addActivity(activity, plannerId, userId);
      _activities.add(newActivity); // Add to local state if successful
      notifyListeners(); // Notify listeners about the change
    } catch (e) {
      _errorMessage = 'Failed to add activity: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return newActivity;
  }


  // ----------------------------------------
  // UPDATERS
  // ----------------------------------------

  Future<Planner> updatePlanner(Planner planner, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Planner updatedPlanner = planner;
    try {
      updatedPlanner = await _plannerService.updatePlanner(updatedPlanner, userId);
      _planners
          .firstWhere((planner) => planner.plannerId == updatedPlanner.plannerId)
          .update(updatedPlanner); // Update local state if successful
    } catch (e) {
      _errorMessage = 'Failed to update planner: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return updatedPlanner;
  }

  Future<Destination> updateDestination(Destination destination, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Destination updatedDestination = destination;
    try {
      updatedDestination =
          await _plannerService.updateDestination(updatedDestination, userId);
      _destinations
          .firstWhere((destination) =>
              destination.destinationId == updatedDestination.destinationId)
          .update(updatedDestination); // Update local state if successful
    } catch (e) {
      _errorMessage = 'Failed to update destination.';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return updatedDestination;
  }

  Future<Transport> updateTransport(Transport transport, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Transport updatedTransport = transport;
    try {
      updatedTransport =
          await _plannerService.updateTransport(updatedTransport, userId);

      _transports
          .firstWhere((transport) =>
              transport.id == updatedTransport.id)  
          .update(updatedTransport); // Update local state if successful
  
    } catch (e) {
      _errorMessage = 'Failed to update transportation.}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return updatedTransport;
  }

  Future<Accommodation?> updateAccommodation(Accommodation accommodation, String plannerId, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Accommodation? updatedAccommodation;
    try {
      updatedAccommodation = await _plannerService.updateAccommodation(accommodation, plannerId, userId);
    } catch (e) {
      _errorMessage = 'Failed to update accommodation.';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return updatedAccommodation;
  }

  Future<Activity?> updateActivity(Activity activity, String plannerId, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    Activity? updatedActivity;
    try {
      updatedActivity = await _plannerService.updateActivity(activity, plannerId, userId);
    } catch (e) {
      _errorMessage = 'Failed to update activity.';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
    return updatedActivity;
  }


  // ----------------------------------------
  // DELETERS
  // ----------------------------------------


  Future<void> deletePlanner(Planner planner, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    try {
      await _plannerService.deletePlanner(planner, userId);
      _planners.remove(planner); // Remove from local state if successful
    } catch (e) {
      _errorMessage = 'Failed to delete planner: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
  }

  Future<void> deleteDestination(Destination destination, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    try {
      await _plannerService.deleteDestination(destination, userId);
      _destinations.remove(destination); // Remove from local state if successful
    } catch (e) {
      _errorMessage = 'Failed to delete destination: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
  }

  Future<void> deleteTransport(Transport transport, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    try {
      await _plannerService.deleteTransport(transport, userId);
      _transports.remove(transport); // Remove from local state if successful
    } catch (e) {
      _errorMessage = 'Failed to delete transportation: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
  }

  Future<void> deleteAccommodation(Accommodation accommodation, String plannerId, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    try {
      await _plannerService.deleteAccommodation(accommodation, plannerId, userId);
    } catch (e) {
      _errorMessage = 'Failed to delete accommodation: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
  }

  Future<void> deleteActivity(Activity activity, String plannerId, String userId) async {
    _isLoading = true;
    _errorMessage = null; // Reset error message
    notifyListeners();

    try {
      await _plannerService.deleteActivity(activity, plannerId, userId);
    } catch (e) {
      _errorMessage = 'Failed to delete activity: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify listeners whether success or failure
    }
  }


  Future<void> inviteUserToPlanner(String plannerId, String userId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      Planner updated = await _plannerService.inviteUserToPlanner(plannerId, userId);

      _planners
          .firstWhere((planner) => planner.plannerId == updated.plannerId)
          .update(updated);

    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  void logout() {
    _planners = [];
    _destinations = [];
    _activities = [];
    _transports = [];
    _accommodations = [];
    _errorMessage = null;
    notifyListeners();
  }

  @override
  void dispose() {
    super.dispose();
  }
}
