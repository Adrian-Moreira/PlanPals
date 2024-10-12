import 'package:flutter/material.dart';
import 'package:planpals/db/mock_db.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/planner_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/planner_card.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/navigator_bar.dart';
import 'package:provider/provider.dart';

class PlannersView extends StatefulWidget {
  @override
  _PlannersViewState createState() => _PlannersViewState();
}

class _PlannersViewState extends State<PlannersView> {
  @override
  void initState() {
    super.initState();
    // Fetch planners when the widget is first created
    WidgetsBinding.instance.addPostFrameCallback((_) {
      User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;
      Provider.of<PlannerViewModel>(context, listen: false).fetchPlannersByUserId(user.id);
    });
  }

  @override
  Widget build(BuildContext context) {
    PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context);
    User user = Provider.of<UserViewModel>(context).currentUser!;
    print('PLANNERSVIEW: USER: $user');

    return Scaffold(
      appBar: const NavigatorAppBar(title: "Travel Planners"),
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
        scrollable: true,
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 30.0, right: 20.0),
        child: SizedBox(
          width: 70.0,
          height: 70.0,
          child: FloatingActionButton(
            onPressed: () {
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
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }
}
