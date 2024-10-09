import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/views/components/cards/transport_card.dart';
import 'package:planpals/features/travel_planner/views/planners_view.dart';
import 'package:planpals/shared/components/generic_list_view.dart';

class HomePage extends StatelessWidget {
  HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // Add the logo image here
            Image.asset(
              'assets/images/logo.jpg', // Make sure the image path is correct
              width: 150, // Adjust the width as needed
              height: 150, // Adjust the height as needed
            ),
            const SizedBox(
                height: 20), // Add spacing between the image and text
            const Text(
              'Welcome to PlanPals!',
              style: TextStyle(fontSize: 20),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => PlannersView()),  // navigate to travel planners
                );
              },
              child: const Text('Go to Travel Planner'),
            ),
          ],
        ),
      ),
    );
  }
}
