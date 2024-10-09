import 'package:flutter/material.dart';
import 'package:planpals/db/mock_db.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/planner_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/planner_card.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:provider/provider.dart';

class PlannersView extends StatelessWidget {
  PlannersView({super.key});

  // final List<Planner> plannerList = MockDataBase.planners;

  @override
  Widget build(BuildContext context) {

    PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context);
    // plannerViewModel.fetchPlannersByUserId('507f1f77bcf8cd799439011');

    return Scaffold(
      appBar: AppBar(
        title: const Text("Travel Planners"),
      ),
      body: GenericListView(
        itemList: plannerViewModel.planners,
        itemBuilder: (planner) => PlannerCard(
          travelPlanner: planner,
        ),
        onAdd: () {},
        headerTitle: "My Travel Planners",
        headerIcon: Icons.airplanemode_active,
        emptyMessage: "There is no travel planners",
        functional: false,
      ),

      // Add floating action button at the bottom right
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 30.0, right: 20.0),
        child: SizedBox(
          width: 70.0,
          height: 70.0,
          child: FloatingActionButton(
            onPressed: () {
              // navigate to the add planner screen
              Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const PlannerForm()),  // navigate to travel planners
                );
            }, // Add button icon
            tooltip: 'Add Travel Planner',
            child: const Icon(Icons.add, size: 50.0),
          ),
        ),
      ),
      floatingActionButtonLocation:
          FloatingActionButtonLocation.endFloat, // Position at bottom right
    );
  }
}
