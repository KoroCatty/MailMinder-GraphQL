// Media Queries for Responsive Design

const breakpoints = [1, 480, 768, 992]; //ブレイクポイント
export const min = breakpoints.map((bpMin) => `@media (min-width: ${bpMin}px)`);

const breakpoints2 = [479, 767, 991, 1200]; //ブレイクポイント
export const max = breakpoints2.map((bpMax) => ` and (max-width: ${bpMax}px)`);

// Example
// const NavUl = css`
/* // 1px〜479px
    ${min[0] + max[0]}{
    }
    // 480px〜767px
    ${min[1] + max[1]}{
    }
    // 768px〜989px
    ${min[2] + max[2]}{
    }
    // 990px〜1200px
    ${min[3] + max[3]}{
    } */
