import 'package:flutter/material.dart';
<<<<<<< HEAD
import 'package:planpals/destination_test.dart';
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
import 'package:planpals/features/home/views/home_page.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/profile/views/login_page.dart';
import 'package:planpals/features/profile/views/signup_page.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
<<<<<<< HEAD
import 'package:planpals/features/travel_planner/views/components/Forms/create/create_activity_form.dart';
=======
import 'package:planpals/features/travel_planner/views/components/Forms/planner_form.dart';
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
import 'package:planpals/features/travel_planner/views/planner_details_view.dart';
import 'package:planpals/features/travel_planner/views/planners_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => PlannerViewModel()),
        ChangeNotifierProvider(create: (context) => UserViewModel()),
      ],
      child: SafeArea(
        child: GestureDetector(
          onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
          child: MaterialApp(
            title: 'Travel Planner',
            theme: ThemeData(
              primarySwatch: Colors.blue,
            ),
            initialRoute: '/login', // Set the initial route to login
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/main.dart
            // home: CreateActivityForm(),
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/main.dart
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
            routes: {
              '/home': (context) => HomePage(),
              '/login': (context) => LoginPage(),
              '/signup': (context) => SignUpPage(),
              '/planners': (context) => const PlannersView(),
<<<<<<< HEAD
<<<<<<< HEAD:front-end-android/planpals/lib/main.dart
              '/test': (context) => DestinationTest(),
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/main.dart
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
            },
          ),
        ),
      ),
    );
  }
}
