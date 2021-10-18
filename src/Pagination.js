import React, { Component } from 'react';
import classNames from 'classnames';
import { Pagination as BSPagination, PaginationItem, PaginationLink } from 'reactstrap';

const defaultButton = ({ ...props }) => <PaginationLink {...props} />;

export default class ReactTablePagination extends Component {
  constructor(props) {
    super();

    this.getSafePage = this.getSafePage.bind(this);
    this.changePage = this.changePage.bind(this);
    this.applyPage = this.applyPage.bind(this);

    this.state = {
      page: props.page
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ page: nextProps.page });
  }

  getSafePage(page) {
    if (Number.isNaN(page)) {
      page = this.props.page;
    }
    return Math.min(Math.max(page, 0), this.props.pages - 1);
  }

  changePage(page) {
    page = this.getSafePage(page);
    this.setState({ page });
    if (this.props.page !== page) {
      this.props.onPageChange(page);
    }
  }

  applyPage(e) {
    if (e) {
      e.preventDefault();
    }
    const page = this.state.page;
    this.changePage(page === '' ? this.props.page : page);
  }

  getFirstRecord(page, pageSize, totalSize) {
    if (!totalSize) {
      return 0;
    }
    return page * pageSize + 1;
  }

  getLastRecord(page, pageSize, totalSize, currentCount) {
    if (!totalSize) {
      return 0;
    }
    // const rec = (page + 1) * pageSize;
    return this.getFirstRecord(page, pageSize, totalSize) + currentCount - 1;
  }

  getPageElement = index => {
    const { page } = this.props;
    return (
      <PaginationItem key={index}>
        <PaginationLink
          className={classNames({ 'this-page': page === index })}
          onClick={() => this.changePage(index)}
        >
          {index + 1}
        </PaginationLink>
      </PaginationItem>
    );
  };

  pagination = () => {
    const items = [];
    const { page, pageRangeDisplayed, totalSize, pageSize, marginPagesDisplayed } = this.props;

    const BreakView = () => (
      <PaginationItem>
        <PaginationLink disabled>{'...'}</PaginationLink>
      </PaginationItem>
    );

    const pageCount = Math.ceil(totalSize / pageSize);

    if (pageCount <= pageRangeDisplayed) {
      for (let index = 0; index < pageCount; index++) {
        items.push(this.getPageElement(index));
      }
    } else {
      let leftSide = pageRangeDisplayed / 2;
      let rightSide = pageRangeDisplayed - leftSide;

      if (page > pageCount - pageRangeDisplayed / 2) {
        rightSide = pageCount - page;
        leftSide = pageRangeDisplayed - rightSide;
      } else if (page < pageRangeDisplayed / 2) {
        leftSide = page;
        rightSide = pageRangeDisplayed - leftSide;
      }

      let index;
      let currPage;
      let breakView;
      let createPageView = index => this.getPageElement(index);

      for (index = 0; index < pageCount; index++) {
        currPage = index + 1;

        if (currPage <= marginPagesDisplayed) {
          items.push(createPageView(index));
          continue;
        }

        if (currPage > pageCount - marginPagesDisplayed) {
          items.push(createPageView(index));
          continue;
        }

        if (index >= page - leftSide && index <= page + rightSide) {
          items.push(createPageView(index));
          continue;
        }

        if (items[items.length - 1] !== breakView) {
          breakView = <BreakView key={index} />;
          items.push(breakView);
        }
      }
    }

    return items;
  };

  render() {
    const {
      // Computed
      pages,
      // Props
      page,
      pageRangeDisplayed,
      marginPagesDisplayed,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      showPageJump,
      canPrevious,
      canNext,
      onPageSizeChange,
      className,
      totalSize,
      currentCount,
      PreviousComponent = defaultButton,
      NextComponent = defaultButton
    } = this.props;

    const PageItem = defaultButton;

    return (
      <div
        className={classNames({
          'ke-pagination-container': true,
          'd-flex': true,
          'flex-row': true,
          'p-2': true,
          'justify-content-between': true
        })}
      >
        <div className={classNames({ 'paging-buttons': true, 'flex-fill': true })}>
          <BSPagination size="sm">
            <PaginationItem>
              <PageItem
                previous
                onClick={() => {
                  if (!canPrevious) return;
                  this.changePage(page - 1);
                }}
                disabled={!canPrevious}
              >
                {'<'}
              </PageItem>
            </PaginationItem>

            {this.pagination()}

            <PaginationItem>
              <PageItem
                next
                onClick={() => {
                  if (!canNext) return;
                  this.changePage(page + 1);
                }}
                disabled={!canNext}
              >
                {'>'}
              </PageItem>
            </PaginationItem>
          </BSPagination>
        </div>
        {showPageSizeOptions && (
          <span
            className={classNames({
              'flex-fill': true,
              'select-wrap': true,
              '-pageSizeOptions': true,
              'text-center': true
            })}
          >
            <select onChange={e => onPageSizeChange(Number(e.target.value))} value={pageSize}>
              {pageSizeOptions.map((option, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <option key={i} value={option}>
                  {`${option} ${this.props.rowsText}`}
                </option>
              ))}
            </select>
          </span>
        )}
        <div className="flex-fill text-right">
          Mostrando {this.getFirstRecord(page, pageSize, totalSize)} desde{' '}
          {this.getLastRecord(page, pageSize, totalSize, currentCount)} de {totalSize}
        </div>
      </div>
    );
  }
}
