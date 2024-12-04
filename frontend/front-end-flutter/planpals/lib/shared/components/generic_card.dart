import 'package:flutter/material.dart';
import 'package:planpals/features/comment/comment_page_view.dart';
import 'package:planpals/features/vote/vote_model.dart';
import 'package:planpals/features/vote/vote_viewmodel.dart';

class GenericCard extends StatefulWidget {
  final Widget title;
  final Widget subtitle;
  final Widget? extraInfo;
  final VoidCallback onDelete;
  final VoidCallback onEdit;
  final bool functional;
  final Vote? vote;
  final String? objectId;
  final String? type;
  final bool? commentable;
  final bool? voteable;

  const GenericCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.onDelete,
    required this.onEdit,
    this.extraInfo,
    this.vote,
    required this.functional,
    this.objectId,
    this.type,
    this.commentable = true,
    this.voteable = true,
  });

  @override
  State<GenericCard> createState() => _GenericCardState();
}

class _GenericCardState extends State<GenericCard> {
  final VoteViewModel _voteViewModel = VoteViewModel();

  late Vote vote;
  bool _voteLoading = true;

  @override
  void initState() {
    super.initState();


    if (widget.vote == null) {
      return;
    }

    vote = widget.vote!;

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      vote = await _voteViewModel.fetchVote(vote);

      setState(() {
        vote = _voteViewModel.vote;
        _voteLoading = _voteViewModel.isloading;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Stack(children: [
        ListTile(
          title: widget.title,
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              widget.subtitle,

              widget.commentable == true && widget.voteable == true

              ? Row(children: [
                _buildVoteButtons(context, vote), // Add vote buttons

                const SizedBox(
                  width: 15,
                ),

                // Add comment button
                IconButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => CommentPageView(
                            objectId: vote.objectId,
                            type: vote.type,
                            item: _buildTile(),
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.comment)),
              ])
              
              : Container(),
              
              widget.extraInfo != null
                ? Column(
                    children: [
                      const SizedBox(height: 10),
                      widget.extraInfo!,
                    ],
                  )
                : Container(),
            ],
          ),
        ),
        widget.functional ? _buildDropdownButton() : Container(),
      ]),
    );
  }

  Widget _buildTile() {
    return ListTile(
      title: widget.title,
      subtitle: widget.subtitle,
    );
  }

  Widget _buildDropdownButton() {
    return Positioned(
      right: 0,
      top: 0,
      child: PopupMenuButton<String>(
        icon: const Icon(Icons.more_vert),
        onSelected: (String result) {
          if (result == 'Edit') {
            widget.onEdit();
          } else if (result == 'Delete') {
            widget.onDelete();
          }
        },
        itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
          const PopupMenuItem<String>(
            value: 'Edit',
            child: Row(
              children: [
                Icon(Icons.edit),
                SizedBox(width: 10),
                Text('Edit'),
              ],
            ),
          ),
          const PopupMenuItem<String>(
            value: 'Delete',
            child: Row(
              children: [
                Icon(Icons.delete),
                SizedBox(width: 10),
                Text('Delete'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVoteButtons(BuildContext context, Vote vote) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        IconButton(
          icon: vote.upVoted
              ? const Icon(Icons.thumb_up)
              : const Icon(Icons.thumb_up_alt_outlined),
          onPressed: () {
            _handleUpVote();

            print("VOTE IN VOTE VIEWMODEL: ${_voteViewModel.vote}");
          },
        ),
        Text('${vote.upVotes.length}'),
        const SizedBox(width: 10),
        IconButton(
          icon: vote.downVoted
              ? const Icon(Icons.thumb_down)
              : const Icon(Icons.thumb_down_alt_outlined),
          onPressed: () {
            _handleDownVote();
          },
        ),
        Text('${vote.downVotes.length}'),
      ],
    );
  }

  Future<void> _handleUpVote() async {
    // Perform the vote action asynchronously
    Vote updatedVote;
    updatedVote = vote.upVoted
        ? await _voteViewModel.removeVote(vote)
        : await _voteViewModel.upVote(vote);

    // Once the operation is complete, call setState to update the UI
    setState(() {
      vote = updatedVote; // Update the local vote with the new state
    });
  }

  Future<void> _handleDownVote() async {
    // Perform the vote action asynchronously
    Vote updatedVote;
    updatedVote = vote.downVoted
        ? await _voteViewModel.removeVote(vote)
        : await _voteViewModel.downVote(vote);

    setState(() {
      vote = updatedVote; // Update the local vote with the new state
    });
  }

  @override
  void dispose() {
    _voteViewModel.dispose();
    super.dispose();
  }
}
