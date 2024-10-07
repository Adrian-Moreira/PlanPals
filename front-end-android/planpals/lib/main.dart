import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/flight_model.dart';
import 'package:planpals/features/travel_planner/models/lists/travel_planner_list_model.dart';
import 'package:planpals/features/travel_planner/models/travel_planner_model.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/accommodation_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/activity_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/flight_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/flight_card.dart';
import 'package:planpals/features/travel_planner/views/components/cards/travel_planner_card.dart';
import 'package:planpals/features/travel_planner/views/components/listviews/flight_list_view.dart';
import 'package:planpals/features/travel_planner/views/components/listviews/travel_planner_list_view.dart';
import 'package:planpals/flight_form_test.dart';
import 'package:planpals/travel_planner_form_test.dart';
import 'package:provider/provider.dart';
import 'features/home/views/home_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: 
        Scaffold(          
          body:
            // FlightForm(onFlightAdd: (Flight f){})
            // TravelPlannerFormTest()
            // AccommodationForm(onAccommodationAdd: (Accommodation){})
            // ActivityForm(onActivityAdd: (Activity ) {  },)
            TravelPlannerListView()

        )
    );
  }
}
