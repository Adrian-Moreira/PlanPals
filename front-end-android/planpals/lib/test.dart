import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:provider/provider.dart';

class Test extends StatelessWidget {
  const Test({super.key});

  @override
  Widget build(BuildContext context) {

    PlannerViewModel viewModel = Provider.of<PlannerViewModel>(context);
    return Container(
      child: ElevatedButton(
        onPressed: () { 
          final planner = Planner(
        plannerId: '12345',
        createdBy: 'user1',
        startDate: DateTime.parse('2024-01-01T12:00:00.000Z'),
        endDate: DateTime.parse('2024-01-10T12:00:00.000Z'),
        name: 'Trip to Bali',
        description: 'A relaxing vacation in Bali.',
        roUsers: ['user2', 'user3'],
        rwUsers: ['user1'],
        destinations: [],
        transportations: [],
      );
            viewModel.addPlanner(planner);
         }, 
        child: const Text("ADD POST"),
      )
    );
  }
}