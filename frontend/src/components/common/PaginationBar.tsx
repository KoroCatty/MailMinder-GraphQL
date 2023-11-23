// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";
const paginationBarCss = css`
margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff; 
  padding: 20px;

  ${min[0] + max[0]} {
    flex-direction: column;
    align-items: stretch; // Stretch the buttons to the full width of the container
    padding: 0;
  }
  
  ${min[1] + max[1]} {
    flex-direction: column;
    align-items: stretch;
    padding: 0;
  }

  .pagination-previous { /* 左の要素 */
    order: 0;
  }

  .pagination-next { /* 真ん中の要素、これを右に移動する */
    order: 2;
}

  .pagination-previous, .pagination-next {
    border: 1px solid #ddd;
    background-color: #fff;
    color: #000;
    padding: 10px 15px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;

    &:disabled {
      color: #aaa;
      cursor: not-allowed;
    }

    // 1px - 479px
    ${min[0] + max[0]} {
      display: none;
    }
    //  480px - 767px
    ${min[1] + max[1]} {
      display: none;
    }
  }

  .pagination-link {
    border: 1px solid #ddd;
    background-color: #fff;
    color: #000;
    padding: 10px 15px;
    margin: 0 5px;
    cursor: pointer;
    border: none;
    border-radius: 4px;

      // 1px - 479px
  ${min[0] + max[0]} {
    margin-top: 2rem;
    justify-content: center;
  }

  //  480px - 767px
  ${min[1] + max[1]} {
    margin-top: 2rem;
    justify-content: center;
  }

    &.is-current {
      background-color: #000;
      color: #f1f1f1;
    }
  }

  .pagination-ellipsis {
    color: #000;
    padding: 10px 15px;
  }

  .pagination-list {
    list-style: none;
    padding: 0;
    display: flex;
    align-items: center;

    // 1px - 479px
    ${min[0] + max[0]} {
      justify-content: center;
  }
    // 480px - 767px
    ${min[1] + max[1]} {
      justify-content: center;
    }

    li {
      margin: 0 2px;

      &:hover {
        cursor: pointer;
        opacity: 0.7;
      }

      @media screen and (max-width: 350px) {
        width: 16px;
        margin: 0 13px;
        transform: translate(-10px, 0);

        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }

  // SP / Tablet Only
  .paginationBtnSP {
    display: none;

    // 1px - 479px
    ${min[0] + max[0]} {
      display: flex;
    }
    // 480px - 767px
    ${min[1] + max[1]} {
      display: flex;
    }

  .pagination-previous__sp, .pagination-next__sp {
    border: 1px solid #ddd;
    background-color: #fff;
    color: #000;
    padding: 10px 15px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
    width: 50%;
    
    &:disabled {
      color: #aaa;
      cursor: not-allowed;
    }
  }
}
`;

// Postのページネーションに関するプロパティの型定義
type PostPropType = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// ページボタンに関するプロパティの型定義
// ここでのpageプロパティはnumber型またはstring型を取る可能性がある
type PageButtonType = {
  page: number | string;
  currentPage: number;
  onClick: () => void;
};

// ページネーションバーのコンポーネント
function PaginationBar({ currentPage, totalPages, onPageChange }: PostPropType) {
  // 表示するべきページの計算
  const pages = getVisiblePages(currentPage, totalPages);
  return (
    <nav css={paginationBarCss} className="pagination is-centered" role="navigation" aria-label="pagination">

      {/* PC */}
      {/* Previous Button */}
      <button className="pagination-previous" aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}>
        &#x25C0;
      </button>
      {/* Next Button */}
      <button className="pagination-next" arial-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}>
        &#x25B6;
      </button>


      {/* SP / Tablet */}
      <div className="paginationBtnSP">
        {/* Previous Button */}
        <button className="pagination-previous__sp" aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}>
          &#x25C0;
        </button>
        {/* Next Button */}
        <button className="pagination-next__sp" arial-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}>
          &#x25B6;
        </button>
      </div>

      {/* Page Links */}
      <ul className="pagination-list">
        {pages.map((page) => (
          <li key={page}>
            {/* PageButtonへのprops渡し */}
            <PageButton page={page} currentPage={currentPage}
              onClick={() => {
                // pageがnumber型の時のみonPageChangeを呼び出す
                if (typeof page === 'number') {
                  onPageChange(page);
                }
              }}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

// 各ページボタンのコンポーネント
function PageButton({ page, currentPage, onClick }: PageButtonType) {
  // 現在のページが選択されている場合
  if (page === currentPage) {
    return (
      <button className="pagination-link is-current"
        aria-label={`Page ${page}`} aria-current="page">
        {page}
      </button>
    );
  }
  // '<' または '>' の場合（省略記号）
  if (page === '<' || page === '>') {
    return (
      <span className="pagination-ellipsis">
        &hellip;
      </span>
    );
  }
  // その他のページボタン
  return (
    <button className="pagination-link" aria-label={`Go to page ${page}`}
      onClick={onClick}>
      {page}
    </button>
  );
}

// 表示するべきページ番号の配列を生成する関数
function getVisiblePages(current: number, total: number) {
  // 合計ページ数が7以下の場合、全ページを表示
  if (total <= 7) {
    return range(total);
  }
  // 現在のページが最初の4ページに含まれる場合
  if (current < 5) {
    return [...range(5), '>', total];
  }
  // 現在のページが最後の4ページに含まれる場合
  if (current > total - 4) {
    return [1, '<', ...range(5, total - 4)];
  }
  // その他の場合（中間のページ）
  return [1, '<', current - 1, current, current + 1, '>', total];
}


// 指定された範囲の数値配列を生成する関数
function range(count: number, start = 1) {
  return Array.from(new Array(count), (_, i) => i + start);
}

export default PaginationBar;
