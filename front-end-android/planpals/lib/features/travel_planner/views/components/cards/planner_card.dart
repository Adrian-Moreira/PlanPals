import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/views/planner_details_view.dart';

class PlannerCard extends StatelessWidget {
  final Planner travelPlanner;

  const PlannerCard({
    super.key,
    required this.travelPlanner,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
        child: ListTile(
      title: Text(travelPlanner.name),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => PlannerDetailsView(
                    travelPlanner: travelPlanner,
                  )), // navigate to travel planners
        );
      },
    ));
  }
}
