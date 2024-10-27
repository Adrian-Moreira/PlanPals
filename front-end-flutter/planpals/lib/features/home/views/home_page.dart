import 'package:flutter/material.dart';
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/features/home/views/home_page.dart
=======
<<<<<<< HEAD
import 'package:planpals/features/travel_planner/views/planners_view.dart';
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/home/views/home_page.dart
=======
<<<<<<< HEAD
import 'package:planpals/features/travel_planner/views/planners_view.dart';
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/views/components/cards/transport_card.dart';
import 'package:planpals/features/travel_planner/views/planners_view.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/navigator_bar.dart';
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/features/home/views/home_page.dart
=======
>>>>>>> f61c82b6c329af1b7e97ff6c6c046514dee96035
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/home/views/home_page.dart
=======
>>>>>>> f61c82b6c329af1b7e97ff6c6c046514dee96035
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const NavigatorAppBar(
        title: 'Home',
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // Add the logo image here
            Image.asset(
                'assets/images/logo.jpg', // Make sure the image path is correct
                width: 150, // Adjust the width as needed
                height: 150, // Adjust the height as needed
                errorBuilder: (context, error, stackTrace) {
              return const Text('Error loading logo');
            }),
            const SizedBox(
                height: 20), // Add spacing between the image and text
            const Text(
              'Welcome to PlanPals!',
              style: TextStyle(fontSize: 20),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/features/home/views/home_page.dart
                Navigator.pushNamed(context, '/planners');
=======
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
<<<<<<< HEAD
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          const PlannersView()), // navigate to travel planners
                );
=======
                Navigator.pushNamed(context, '/planners');
>>>>>>> f61c82b6c329af1b7e97ff6c6c046514dee96035
<<<<<<< HEAD
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/home/views/home_page.dart
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
              },
              child: const Text('Go to Travel Planner'),
            ),
          ],
        ),
      ),
    );
  }
}
