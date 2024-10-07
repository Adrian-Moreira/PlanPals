import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/travel_planner_model.dart';
import 'package:planpals/features/travel_planner/views/travel_planner_details_view.dart';

class TravelPlannerCard extends StatelessWidget {
  final TravelPlanner travelPlanner;

  const TravelPlannerCard({
    super.key,
    required this.travelPlanner,
    });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(travelPlanner.plannerName),
        subtitle: Text(travelPlanner.destination),
        
      )
    );
  }
}