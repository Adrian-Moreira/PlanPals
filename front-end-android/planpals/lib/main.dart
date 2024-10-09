import 'package:flutter/material.dart';
import 'package:planpals/features/home/views/home_page.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/profile/views/login_page.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/planner_form.dart';
import 'package:planpals/features/travel_planner/views/planner_details_view.dart';
import 'package:planpals/features/travel_planner/views/planners_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';
import 'package:provider/provider.dart';


void main() {
  runApp(

     MyApp()

  );
}

class MyApp extends StatelessWidget {
  MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => PlannerViewModel()),
        ChangeNotifierProvider(create: (context) => UserViewModel()),
      ],

      child: SafeArea(
        child: MaterialApp(
          title: 'Travel Planner',
          theme: ThemeData(
            primarySwatch: Colors.blue,
          ),
          home: LoginPage(),
        ),
      ),
    );
  }
}