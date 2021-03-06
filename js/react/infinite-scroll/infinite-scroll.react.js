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
 *   The callback property getNextPageUrl(offset, count) determines
 *   how to construct the url,
 *   the callback property parseResponse(response) dtermines how to
 *   parse the async results,
 *   the property type will specify the type of the async fetching,
 *   and the property options will give the options for fetching.
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
  fetchJsonp: function() {
    // TODO: check the options property
    var scrollPane = this;
    var offset = scrollPane.state.offset;
    var count = scrollPane.props.count;
    var moreItem = scrollPane.refs.moreItem;
    // temporarily deactivate the more item unit
    moreItem.setState({active: false});
    var defaults = {
      url: this.props.getNextPageUrl(offset, count),
      dataType: "jsonp",
      success: function (response) {
        moreResults = scrollPane.props.parseResponse(response);
        noMore = moreResults.length < count;
        scrollPane.setState({
          offset: offset + count,
          results: scrollPane.state.results.concat(moreResults),
          noMore: noMore,
        });
        if (!noMore) {
          // need to reactivate here since this ajax call
          // is asynchronous
          moreItem.setState({active: true});
        }
      }
    };
    var settings = jQuery.extend({}, defaults, this.props.options);
    $.ajax(settings);
  },
  loadMore: function() {
    if (this.props.allResults) {
      // all results are provided, just slice
      var offset = this.state.offset;
      var count = this.props.count;
      var results = this.props.allResults.slice(0, offset + count);
      var noMore = offset + count >= this.props.allResults.length;
      this.setState({
        offset: offset + count,
        results: results,
        noMore: noMore,
      });
    } else {
      // need to fetch asynchronously
      switch (this.props.type) {
        case 'jsonp':
          this.fetchJsonp();
          break;
        // TODO: support more types
        default:
          console.warn("Unsupported Type!");
          break;
      }
    }
  },
  componentDidMount: function() {
    this.loadMore();
  },
  loadMoreOnScroll: function() {
    var moreItem = this.refs.moreItem;
    // neither no more item to show
    // nor a page is being loaded now
    if (React.findDOMNode(moreItem) !== null && moreItem.state.active) {
      if (isVisible(React.findDOMNode(moreItem))) {
        this.loadMore();
      }
    }
  },
  mouseOver: function() {
    $(React.findDOMNode(this.refs.results)).scrollLock();
  },
  mouseOut: function() {
    $(React.findDOMNode(this.refs.results)).scrollLock('off');
  },
  render: function() {
    var renderItem = this.props.renderItem;
    var items = this.state.results.map(function(result) {
      return renderItem(result);
    });
    var outterStyle = {
      position: "relative",
      overflowY: "hidden",
      overflowX: "auto",
      height: "500px",
    };
    jQuery.extend(outterStyle, this.props.customStyle);
    var wrapperStyle = {
      position: "absolute",
      overflowX: "auto",
      overflowY: "auto",
      height: outterStyle.height,
      width: outterStyle.width,
    };
    var scrollAreaWrapper = !this.state.noMore ?
      (
        <div
          className="ScrollableArea" ref="results"
          style={wrapperStyle} onScroll={this.loadMoreOnScroll}
          onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
          {items}
          <MoreItem ref="moreItem" />
        </div>
      ) :
      (
        <div
          className="ScrollableArea" ref="results"
          style={wrapperStyle}
          onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
          {items}
        </div>
      );
    var ret =
      <div style={outterStyle}>
        {scrollAreaWrapper}
      </div>;
    return ret;
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
