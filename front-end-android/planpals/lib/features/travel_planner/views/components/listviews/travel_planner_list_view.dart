import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/shared/components/error_message_screen.dart';
import 'package:planpals/features/travel_planner/viewmodels/travel_planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/cards/travel_planner_card.dart';
import 'package:planpals/shared/components/loading_screen.dart';
import 'package:planpals/shared/network/objects.dart';


// Display all the travel planners that are accessible to the user logged in
class TravelPlannerListView extends StatelessWidget {

  const TravelPlannerListView({super.key});

  @override
  Widget build(BuildContext context) {
    // final plannerViewModel = Provider.of<TravelPlannerViewModel>(context);
    // final user = Provider.of<UserViewModel>(context).currentUser;

    User user = User(userId: "123", username: "Name");

    TravelPlannerViewModel plannerViewModel = TravelPlannerViewModel();
    plannerViewModel.isLoading = false;

    plannerViewModel.travelPlanners = Objects.planners;
    plannerViewModel.fetchTravelPlannersByUserId(user.userId);


                    print(Objects.planners.length);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel Planners'),
      ),
      // body: plannerViewModel.isLoading
      //     ? const LoadingScreen()
      //     : plannerViewModel.errorMessage != null
      //         ? ErrorMessageScreen(errorMessage: plannerViewModel.errorMessage!, appBarTitle: "Travel Planners",)

      body:
            plannerViewModel.errorMessage != null
            ? ErrorMessageScreen(errorMessage: plannerViewModel.errorMessage!, appBarTitle: "Travel Planners",)
              : ListView.builder(
                  // itemCount: plannerViewModel.travelPlanners?.length ?? 0,
                  itemCount: Objects.planners.length,
                  itemBuilder: (context, index) {
                    // final planner = plannerViewModel.travelPlanners!.getTravelPlannerByIndex(index);
                    final planner = Objects.planners.getTravelPlannerByIndex(index);
                    return TravelPlannerCard(travelPlanner: planner);
                  },
                ),

    );
  }
}
