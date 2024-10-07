import 'package:flutter/material.dart';
import 'package:planpals/shared/components/error_message_screen.dart';
import 'package:planpals/features/travel_planner/models/travel_planner_model.dart';
import 'package:planpals/shared/constants/constants.dart';
import 'components/listviews/accommodation_list_view.dart';
import 'components/listviews/activity_list_view.dart';
import 'components/listviews/flight_list_view.dart';


class TravelPlannerDetailsView extends StatelessWidget {
  final TravelPlanner travelPlanner;
  const TravelPlannerDetailsView({super.key, required this.travelPlanner});

  @override
  Widget build(BuildContext context) {
    final travelPlanner = context;

    return 
      // check if travelPlanner is null
      // ignore: unnecessary_null_comparison
      travelPlanner == null
        // if null, display error message for null travel planner
        ? const ErrorMessageScreen(errorMessage: ErrorMessage.nullTravelPlanner, appBarTitle: '',)

        // else display travel planner details
        : _buildTravelPlanner(travelPlanner as TravelPlanner);
  }

  Widget _buildTravelPlanner(TravelPlanner travelPlanner) {
    
    return 
      Scaffold(
        appBar: AppBar(
          title: Text(travelPlanner.plannerName),
        ),

        body:
          CustomScrollView(
            slivers: [
          
              // Sliver app bar
              SliverAppBar(
                expandedHeight: 200.0,
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(travelPlanner.destination),
                ),
                backgroundColor: const Color.fromRGBO(122, 22, 124, 1.0),
              ),
              
          
              SliverToBoxAdapter(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
          
                      const SizedBox(height: 20,),
          
                      FlightListView(
                        flightList: travelPlanner.flights,
                        onAdd: () {
                          return;
                        },
                      ),
                
                      const SizedBox(height: 20,),
                      const Divider(height: 1),
                      const SizedBox(height: 10,),
                
                      AccommodationListView(
                        accommodationList: travelPlanner.accommodations,
                        onAdd: () {
                          return;
                        },
                      ),
                
                      const SizedBox(height: 20,),
                      const Divider(height: 1),
                      const SizedBox(height: 10,),
          
                      ActivityListView(
                        activityList: travelPlanner.activities,
                        onAdd: () {
                          return;
                        },
                      ),
          
                      const SizedBox(height: 20,),
                    ],
                  ),
                ),
              ), 
            ],
          ),
      );
  }
}

