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
import 'package:planpals/shared/components/delete_message.dart';
import 'package:planpals/shared/components/generic_card.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:provider/provider.dart';

class DestinationCard extends StatefulWidget {
  final Destination destination;
  final bool functional;

  const DestinationCard({
    super.key,
    required this.destination,
    required this.functional,
  });

  @override
  State<DestinationCard> createState() => _DestinationCardState();
}

class _DestinationCardState extends State<DestinationCard> {
  late User user;
  late Destination destination;

  @override
  void initState() {
    super.initState();

    destination = widget.destination;
    final PlannerViewModel plannerViewModel = PlannerViewModel();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      user = Provider.of<UserViewModel>(context, listen: false)
          .currentUser!; // get user from provider
      await plannerViewModel.fetchAccommodationsByDestinationId(
          destination.plannerId, destination.destinationId, user.id);
      await plannerViewModel.fetchActivitiesByDestinationId(
          destination.plannerId, destination.destinationId, user.id);

      setState(() {
        destination.accommodationList = plannerViewModel.accommodations;
        destination.activityList = plannerViewModel.activities;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final User? user =
        Provider.of<UserViewModel>(context, listen: false).currentUser;

    final PlannerViewModel _plannerViewModel =
        Provider.of<PlannerViewModel>(context, listen: false);

    Destination destination = widget.destination;

    return GenericCard(
      title: Text(
        widget.destination.name,
        style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
      ),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
              'Departure: ${DateTimeFormat.formatDateTime(widget.destination.startDate)}'),
          Text(
              'Arrival: ${DateTimeFormat.formatDateTime(widget.destination.endDate)}'),
        ],
      ),
      extraInfo: _buildCollapsableContent(context, widget.destination),
      onDelete: () {
        showDialog(
          context: context,
          builder: (context) => DeleteMessage(onDelete: () {
            // Delete destination
            _plannerViewModel.deleteDestination(widget.destination, user!.id);

            // Show Snackbar based on success or error
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              content: Text(_plannerViewModel.errorMessage ??
                  'Destination deleted successfully!'),
            ));
          }),
        );
      },
      onEdit: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                UpdateDestinationForm(destination: widget.destination),
          ),
        );
      },
      vote: destination.vote,
      functional: widget.functional,
    );
  }

  Widget _buildCollapsableContent(
      BuildContext context, Destination destination) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(0.0),
      ),
      child: ExpansionTile(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${destination.accommodationList.length} accommodations',
                style: const TextStyle(fontSize: 15)),
            Text('${destination.activityList.length} activities',
                style: const TextStyle(fontSize: 15)),
          ],
        ),
        children: [
          // Display Accommodations
          _buildAccommodationList(destination.accommodationList),

          const SizedBox(height: 15),

          // Display Activities
          _buildActivityList(destination.activityList),

          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildAccommodationList(List<Accommodation> accommodations) {
    return GenericListView(
      itemList: destination.accommodationList,
      itemBuilder: (accommodation) => AccommodationCard(
        destination: destination,
        accommodation: accommodation,
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
            builder: (context) =>
                CreateAccommodationForm(destination: destination),
          ),
        );
      },
      headerStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
      headerIconSize: 25,
    );
  }

  Widget _buildActivityList(List<Activity> activities) {
    return GenericListView(
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
      headerIcon: Icons.event,
      emptyMessage: "No Activities",
      onAdd: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CreateActivityForm(destination: destination),
          ),
        );
      },
      headerStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
      headerIconSize: 25,
    );
  }
}
