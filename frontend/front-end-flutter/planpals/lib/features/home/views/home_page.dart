import 'package:flutter/material.dart';
import 'package:planpals/shared/components/navigator_bar.dart';

class HomePage extends StatelessWidget {
  HomePage({super.key});

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
                Navigator.pushNamed(context, '/planners');
              },
              child: const Text('Go to Travel Planner'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/shoppingLists');
              },
              child: const Text('Go to Shopping Lists'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/todoLists');
              },
              child: const Text('Go to Todo Lists'),
            ),
          ],
        ),
      ),
    );
  }
}
