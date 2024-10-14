import 'package:flutter/material.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/profile/views/login_page.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
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
        child: MaterialApp(
          title: 'Travel Planner',
          theme: ThemeData(
            primarySwatch: Colors.blue,
          ),
          home: LoginPage(),
          // home: LoginPage(),
        ),
      ),
    );
  }
}
