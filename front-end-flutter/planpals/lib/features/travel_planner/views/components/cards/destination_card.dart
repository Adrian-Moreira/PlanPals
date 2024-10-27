import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/create/create_accommodation_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/create/create_activity_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/update/update_destination_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/accommodation_card.dart';
import 'package:planpals/features/travel_planner/views/components/cards/activity_card.dart';
import 'package:planpals/mockdb.dart';
import 'package:planpals/shared/components/delete_message.dart';
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

  @override
  void initState( ) {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      user = Provider.of<UserViewModel>(context, listen: false).currentUser;
      Provider.of<PlannerViewModel>(context, listen: false).fetchAccommodationsByDestinationId(widget.destination.plannerId, widget.destination.destinationId, user!.id);
      Provider.of<PlannerViewModel>(context, listen: false).fetchActivitiesByDestinationId(widget.destination.plannerId, widget.destination.destinationId, user!.id);
    });
  }


  @override
  Widget build(BuildContext context) {
    PlannerViewModel plannerViewModel =
        Provider.of<PlannerViewModel>(context, listen: false);

    List<Accommodation> accommodations = MockDatabase.getAccommodations();
    List<Activity> activities = MockDatabase.getActivities();

    return Card(
<<<<<<< HEAD:front-end-android/planpals/lib/features/travel_planner/views/components/cards/destination_card.dart
      child: ExpansionTile(
        title: Text(widget.destination.name,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 25)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
                'Departure: ${DateTimeFormat.formatDateTime(widget.destination.startDate)}'),
            Text(
                'Arrival: ${DateTimeFormat.formatDateTime(widget.destination.endDate)}'),
            Text('${widget.destination.accommodations.length} accommodations'),
            Text('${widget.destination.activities.length} activities'),
          ],
        ),
        
        children: [
          GenericListView(
            itemList: plannerViewModel.accommodations,
            itemBuilder: (accommodation) => AccommodationCard(
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
                          destination: widget.destination,)),
              );
            },
            headerStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            headerIconSize: 25,
=======
      child: ListTile(
          title: Text(destination.name, style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                  'Departure: ${DateTimeFormat.formatDateTime(destination.startDate)}'),
              Text(
                  'Arrival: ${DateTimeFormat.formatDateTime(destination.endDate)}'),
            ],
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/cards/destination_card.dart
          ),

          GenericListView(
            itemList: plannerViewModel.activities,
            itemBuilder: (activity) => ActivityCard(
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
                          destination: widget.destination,)),
              );
            },
            headerStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            headerIconSize: 25,
          ),
        ],
      ),
    );
  }
}
