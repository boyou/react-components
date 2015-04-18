/**
 * Component for displaying paged results
 *
 * Load one more page when scrolled to the bottom.
 * The loading repeates infinitely.
 *
 *
 * The number of results per page is determined by
 * the count property.
 *
 * The callback property renderItem(result) will
 * render a single result.
 *
 * There are two different fetching behaviors:
 * - All results are fetched at once
 *   This is provided as the allResults property
 * - The results for one page are fetched when needed
 *   This is controlled by the callback property
 *   getNextPageUrl(offset, count).
 *   The callback property fetchPage(url, component) will fetch the
 *   result, and update the results state asynchronously.
 *
 *
 * The current offset, results already displayed and
 * whether there are more results to show are kept in the state.
 */

var InfiniteScroll = React.createClass({
  getInitialState: function() {
    return {
      offset: 0,
      results: [],
      noMore: false,
    };
  },
  loadMore: function() {
    var offset = this.state.offset;
    var count = this.props.count;
    var results;
    var noMore;
    if (this.props.allResults) {
      // all results are provided, just slice
      results = this.props.allResults.slice(0, offset + count);
      noMore = offset + count >= this.props.allResults.length;
      this.setState({
        offset: offset + count,
        results: results,
        noMore: noMore,
      });
    } else {
      // need to fetch asynchronously
      this.props.fetch(this.props.getNextPageUrl(offset, count), this);
    }
  },
  componentDidMount: function() {
    this.loadMore();
  },
  loadMoreOnScroll: function() {
    var moreItem = this.refs.moreItem;
    // no more item to show
    if (!React.findDOMNode(moreItem)) {
      return;
    }
    // a page is being loaded now
    if (!moreItem.state.active) {
      return;
    }
    if (isVisible(React.findDOMNode(moreItem))) {
      this.loadMore();
    }
  },
  render: function() {
    var renderItem = this.props.renderItem;
    var items = this.state.results.map(function(result) {
      return renderItem(result);
    });
    return !this.state.noMore ?
      (
        <div ref="results" onWheel={this.loadMoreOnScroll}>
          {items}
          <MoreItem ref="moreItem" />
        </div>
      ) :
      (
        <div ref="results">
          {items}
        </div>
      );
  },
});

var MoreItem = React.createClass({
  getInitialState: function() {
    return {
      active: true,
    };
  },
  render: function() {
    // Show spinner when results is being fetched
    return this.state.active ?
      <div><span style={{backgroundColor: "#D3D3D3"}}>See More</span></div> :
      <div className="spinner"></div>;
  }
});
