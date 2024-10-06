import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/viewmodels/travel_planner_viewmodel.dart';
import 'package:provider/provider.dart';
import 'features/home/views/home_page.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return 
    MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text("PlanPals"),
        )
      ),
    );
  } //build
}
