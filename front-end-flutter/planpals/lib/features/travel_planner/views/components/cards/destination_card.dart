import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/create/create_accommodation_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/create/create_activity_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/accommodation_card.dart';
import 'package:planpals/features/travel_planner/views/components/cards/activity_card.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:provider/provider.dart';

class DestinationCard extends StatefulWidget {
  final Destination destination;
  final bool functional;

  const DestinationCard(
      {super.key, required this.destination, required this.functional});

  @override
  State<DestinationCard> createState() => _DestinationCardState();
}

class _DestinationCardState extends State<DestinationCard> {
  User? user;

  bool _hasFetchedData = false;

@override
void initState() {
  super.initState();
  WidgetsBinding.instance.addPostFrameCallback((_) async {
    Destination destination = widget.destination;
    if (!_hasFetchedData) {
      user = Provider.of<UserViewModel>(context, listen: false).currentUser;
      destination.accommodationList = await Provider.of<PlannerViewModel>(context, listen: false).fetchAccommodationsByDestinationId(destination.plannerId, destination.destinationId, user!.id);
      destination.activityList = await Provider.of<PlannerViewModel>(context, listen: false).fetchActivitiesByDestinationId(destination.plannerId, destination.destinationId, user!.id);
      _hasFetchedData = true; // Set the flag to true after fetching
    }
  });
}


  @override
  Widget build(BuildContext context) {
    PlannerViewModel plannerViewModel =
        Provider.of<PlannerViewModel>(context, listen: false);

    Destination destination = widget.destination;

    return Card(
      child: ExpansionTile(
        title: Text(destination.name,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 25)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
                'Departure: ${DateTimeFormat.formatDateTime(destination.startDate)}'),
            Text(
                'Arrival: ${DateTimeFormat.formatDateTime(destination.endDate)}'),
            Text('${destination.accommodations.length} accommodations'),
            Text('${destination.activities.length} activities'),
          ],
        ),
        
        children: [
          // Display Accommodations
          GenericListView(
            itemList: destination.accommodationList,
            itemBuilder: (accommodation) => AccommodationCard(
              destination: destination,
              accommodation: accommodation,
              onEdit: () {},
              onDelete: () {},
              functional: widget.functional,
            ),
            functional: widget.functional,
            headerTitle: "Accommodations",
            headerIcon: Icons.hotel,
            emptyMessage: "No Accommodations",
            onAdd: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => CreateAccommodationForm(
                          destination: destination,)),
              );
            },
            headerStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            headerIconSize: 25,
          ),


          // Display Activities
          GenericListView(
            itemList: destination.activityList,
            itemBuilder: (activity) => ActivityCard(
              destination: destination,
              activity: activity,
              onEdit: () {},
              onDelete: () {},
              functional: widget.functional,
            ),
            functional: widget.functional,
            headerTitle: "Activities",
            headerIcon: Icons.hotel,
            emptyMessage: "No Activities",
            onAdd: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => CreateActivityForm(
                          destination: destination,)),
              );
            },
            headerStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            headerIconSize: 25,
          ),

          SizedBox(height: 20),
        ],
      ),
    );
  }
}
