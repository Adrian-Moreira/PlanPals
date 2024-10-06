import 'package:flutter/material.dart';
import 'package:planpals/core/components/error_message_screen.dart';
import 'package:planpals/features/travel_planner/viewmodels/travel_planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/travel_planner_view.dart';
import 'package:provider/provider.dart';


class TravelPlannerListView extends StatelessWidget {
  final String userId;

  const TravelPlannerListView({super.key, required this.userId});

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<TravelPlannerViewModel>(context);

    // Trigger the fetching of travel planners for the user
    if (viewModel.travelPlanners == null && !viewModel.isLoading) {
      viewModel.fetchTravelPlannersByUserId(userId);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel Planners'),
      ),
      body: viewModel.isLoading
          ? const Center(child: CircularProgressIndicator())
          : viewModel.errorMessage != null
              ? ErrorMessageScreen(errorMessage: viewModel.errorMessage!, appBarTitle: "Travel Planners",)
              : ListView.builder(
                  itemCount: viewModel.travelPlanners?.length ?? 0,
                  itemBuilder: (context, index) {
                    final planner = viewModel.travelPlanners!.getTravelPlannerByIndex(index);
                    return TravelPlannerView(travelPlanner: planner);
                  },
                ),
    );
  }
}
