import 'package:flutter/material.dart';
import 'package:planpals/features/home/views/home_page.dart';
import 'package:planpals/features/profile/views/login_page.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/planner_form.dart';
import 'package:planpals/features/travel_planner/views/planner_details_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';


void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: MaterialApp(
        title: 'Travel Planner',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: LoginPage(),
        // home: LoginPage(),
      ),
    );
  }
}



// TravelPlanner travelPlanner = TravelPlanner(
//         travelPlanId: '123',
//         destination: 'Winnipeg',
//         plannerName: 'Winnipeg Trip',
//         startDate: DateTime.now(),
//         endDate: DateTime.now(),
//         createdAt: DateTime.now(),
//         userId: '123',
//         flights: [
//           Flight(
//               flightNumber: '123',
//               departureAirport: 'WPG',
//               arrivalAirport: 'NYC',
//               departureDateTime: DateTime.now(),
//               arrivalDateTime: DateTime.now(),
//               travelPlanId: '123'),
//           Flight(
//               flightNumber: '123',
//               departureAirport: 'WPG',
//               arrivalAirport: 'NYC',
//               departureDateTime: DateTime.now(),
//               arrivalDateTime: DateTime.now(),
//               travelPlanId: '123'),
//           Flight(
//               flightNumber: '123',
//               departureAirport: 'WPG',
//               arrivalAirport: 'NYC',
//               departureDateTime: DateTime.now(),
//               arrivalDateTime: DateTime.now(),
//               travelPlanId: '123'),
//         ],
//         accommodations: [
//           Accommodation(
//               accommodationId: '123',
//               name: 'Hotel',
//               address: '123 address street',
//               checkIn: DateTime.now(),
//               checkOut: DateTime.now(),
//               pricePerNight: '120',
//               travelPlanId: '123'),
//           Accommodation(
//               accommodationId: '123',
//               name: 'Hotel',
//               address: '123 address street',
//               checkIn: DateTime.now(),
//               checkOut: DateTime.now(),
//               pricePerNight: '120',
//               travelPlanId: '123'),
//           Accommodation(
//               accommodationId: '123',
//               name: 'Hotel',
//               address: '123 address street',
//               checkIn: DateTime.now(),
//               checkOut: DateTime.now(),
//               pricePerNight: '120',
//               travelPlanId: '123'),
//           Accommodation(
//               accommodationId: '123',
//               name: 'Hotel',
//               address: '123 address street',
//               checkIn: DateTime.now(),
//               checkOut: DateTime.now(),
//               pricePerNight: '120',
//               travelPlanId: '123'),
//         ],
//         activities: [
//           Activity(
//               activityId: '123',
//               activityName: 'Hiking',
//               startDate: DateTime.now(),
//               endDate: DateTime.now(),
//               travelPlanId: '123'),
//           Activity(
//               activityId: '123',
//               activityName: 'Hiking',
//               startDate: DateTime.now(),
//               endDate: DateTime.now(),
//               travelPlanId: '123'),
//           Activity(
//               activityId: '123',
//               activityName: 'Hiking',
//               startDate: DateTime.now(),
//               endDate: DateTime.now(),
//               travelPlanId: '123'),
//           Activity(
//               activityId: '123',
//               activityName: 'Hiking',
//               startDate: DateTime.now(),
//               endDate: DateTime.now(),
//               travelPlanId: '123'),
//           Activity(
//               activityId: '123',
//               activityName: 'Hiking',
//               startDate: DateTime.now(),
//               endDate: DateTime.now(),
//               travelPlanId: '123'),
//         ]);

      // FlightForm(onFlightAdd: (Flight f){})
      // TravelPlannerFormTest()
      // AccommodationForm(onAccommodationAdd: (Accommodation){})
      // ActivityForm(onActivityAdd: (Activity ) {  },)
      // TravelPlannerListView()
      // TravelPlannerDetailsView(travelPlanner: travelPlanner)