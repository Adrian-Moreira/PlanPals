import 'package:flutter/material.dart';
import 'package:planpals/db/mock_db.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/planner_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/planner_card.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:provider/provider.dart';

class PlannersView extends StatefulWidget {
  final User user;

  const PlannersView({super.key, required this.user});

  @override
  _PlannersViewState createState() => _PlannersViewState();
}

class _PlannersViewState extends State<PlannersView> {
  late PlannerViewModel plannerViewModel;

  @override
  void initState() {
    super.initState();
    plannerViewModel = Provider.of<PlannerViewModel>(context, listen: false);
    _fetchPlanners();
  }

  Future<void> _fetchPlanners() async {
    try {
      await plannerViewModel.fetchPlannersByUserId(widget.user.id);
    } catch (e) {
      print('Error fetching planners: $e');
      // Handle error, e.g., show a snackbar or a dialog
    }
  }

  @override
  Widget build(BuildContext context) {
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
        emptyMessage: "There are no travel planners",
        functional: false,
      ),
      floatingActionButton: Padding(
  padding: const EdgeInsets.only(bottom: 30.0, right: 20.0),
  child: SizedBox(
    width: 70.0,
    height: 70.0,
    child: FloatingActionButton(
      onPressed: () {
        // Check if the PlannerForm is correctly defined and functional
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const PlannerForm()),
        );
      },
      tooltip: 'Add Travel Planner',
      child: const Icon(Icons.add, size: 50.0),
    ),
  ),
),
      floatingActionButtonLocation:
          FloatingActionButtonLocation.endFloat,
    );
  }
}
