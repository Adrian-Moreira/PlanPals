import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/flight_model.dart';
import 'package:planpals/features/travel_planner/models/lists/travel_planner_list_model.dart';
import 'package:planpals/features/travel_planner/models/travel_planner_model.dart';

class Objects {
  DateTime date = DateTime.now();

  static Flight f1 = Flight(
    flightNumber: 'AA123',
    departureAirport: 'JFK',
    arrivalAirport: 'LAX',
    departureDateTime: DateTime.now(),
    arrivalDateTime: DateTime.now().add(Duration(hours: 6)),
    travelPlanId: 'plan123',
  );

  static Flight f2 = Flight(
    flightNumber: 'AA456',
    departureAirport: 'LAX',
    arrivalAirport: 'SFO',
    departureDateTime: DateTime.now(),
    arrivalDateTime: DateTime.now().add(Duration(hours: 1)),
    travelPlanId: 'plan123',
  );

  static Activity activity1 = Activity(
    activityId: 'act001',
    activityName: 'Hiking Trip',
    startDate: DateTime(2024, 11, 1, 9, 0), // November 1, 2024, 9:00 AM
    endDate: DateTime(2024, 11, 1, 17, 0), // November 1, 2024, 5:00 PM
    travelPlanId: 'plan123',
  );

  static Activity activity2 = Activity(
    activityId: 'act002',
    activityName: 'City Tour',
    startDate: DateTime(2024, 11, 2, 10, 0), // November 2, 2024, 10:00 AM
    endDate: DateTime(2024, 11, 2, 15, 0), // November 2, 2024, 3:00 PM
    travelPlanId: 'plan123',
  );

  static Accommodation accommodation1 = Accommodation(
    accommodationId: 'acc001',
    name: 'Mountain View Hotel',
    address: '123 Mountain Rd, Denver, CO 80203',
    checkIn: DateTime(2024, 11, 1), // Check-in on November 1, 2024
    checkOut: DateTime(2024, 11, 5), // Check-out on November 5, 2024
    pricePerNight: '150.00', // Price per night
    travelPlanId: 'plan123',
  );

  static Accommodation accommodation2 = Accommodation(
    accommodationId: 'acc002',
    name: 'Beachfront Resort',
    address: '456 Ocean Ave, Miami, FL 33139',
    checkIn: DateTime(2024, 11, 6), // Check-in on November 6, 2024
    checkOut: DateTime(2024, 11, 10), // Check-out on November 10, 2024
    pricePerNight: '200.00', // Price per night
    travelPlanId: 'plan123',
  );

  static TravelPlannerList planners = TravelPlannerList(travelPlanners: [
    TravelPlanner(
        travelPlanId: '123',
        destination: 'Winnipeg',
        plannerName: 'Trip',
        startDate: DateTime.now(),
        endDate: DateTime.now(),
        createdAt: DateTime.now(),
        userId: '123',
        flights: [],
        accommodations: [],
        activities: [])
  ]);
}
